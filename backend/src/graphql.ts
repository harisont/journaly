import { schema } from 'nexus-future'

schema.objectType({
  name: 'User',
  definition(t) {
    t.model.Id()
    t.model.Name()
    t.model.Email()
    t.model.Password()
    t.model.posts({
      pagination: false,
    })
  },
})

schema.objectType({
  name: 'Post',
  definition(t) {
    t.model.Id()
    t.model.Title()
    t.model.Body()
    t.model.author()
    t.model.Published()
  },
})

schema.queryType({
  definition(t) {
    t.list.field('posts', {
      type: 'Post',
      resolve: async (parent, args, ctx) => ctx.db.post.findMany(),
    }),
      t.list.field('feed', {
        type: 'Post',
        args: {
          Published: schema.booleanArg(),
        },
        resolve: async (parent, args, ctx) => {
          return ctx.db.post.findMany({
            where: {
              Published: args.Published,
            },
          })
        },
      }),
      t.list.field('users', {
        type: 'User',
        resolve: async (parent, args, ctx) => {
          return ctx.db.user.findMany()
        },
      })
  },
})

schema.mutationType({
  definition(t) {
    t.field('createUser', {
      type: 'User',
      args: {
        Name: schema.stringArg({ required: true }),
        Email: schema.stringArg({ required: true }),
        Password: schema.stringArg({ required: true }),
      },
      resolve: (parent, args, ctx) =>
        ctx.db.user.create({
          data: {
            Name: args.Name,
            Email: args.Email,
            Password: args.Password,
          },
        }),
    })
    t.field('createPost', {
      type: 'Post',
      args: {
        Title: schema.stringArg({ required: true }),
        Body: schema.stringArg({ required: true }),
        Published: schema.booleanArg({ required: true }),
        authorEmail: schema.stringArg({ required: true }),
      },
      resolve: async (parent, args, ctx) =>
        ctx.db.post.create({
          data: {
            Title: args.Title,
            Body: args.Title,
            author: {
              connect: {
                Email: 'ro@bin.com',
              },
            },
            Published: args.Published,
          },
        }),
    })
  },
})