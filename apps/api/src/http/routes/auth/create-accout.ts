import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { hash } from 'bcryptjs'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/users', {
    schema: {
      body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6)
      })
    }
  }, async (request, replay) => {
    const { name, email, password } = request.body

    const useWithSameEmail = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (useWithSameEmail) {
      replay.status(400).send({
        message: 'Use with same email already exists.'
      })
    }

    const passwordHash = await hash(password, 8)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      }
    })

    return replay.status(201).send()
  })
}