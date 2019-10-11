const swagger = [
  {
    openapi: '3.0.0',
    basePath: '/v2',
    info: {
      title: 'Swagger PassCulture',
      description:
        'This is a sample Petstore server.  You can find\nout more about Swagger at\n[http://swagger.io](http://swagger.io) or on\n[irc.freenode.net, #swagger](http://swagger.io/irc/).\n',
      termsOfService: 'http://swagger.io/terms/',
      contact: {
        email: 'dev@passculture.app',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      version: '1.0.0',
    },
    externalDocs: {
      description: 'description des externalDocs ',
      url: 'http://swagger.io',
    },
    servers: [
      {
        url: 'https://backend.passculture-integration.beta.gouv.fr/v2/',
        description:
          "Les webservices peuvent être appelés à l'url suivante pour l’environnement de test et d’intégration",
      },
      {
        url: 'https://backend.passculture.beta.gouv.fr/v2',
        description:
          "Les webservices peuvent être appelés à l'url suivant pour l’environnement de production",
      },
    ],
    tags: [
      {
        name: 'BOOKINGS ou CONTREMARQUE',
        description:
          "Le dispositif repose sur deux éléments principaux :</br></br><ul><li> - l’affichage, directement sur l'application mobile pass Culture, de codes de réservations sous la forme de QR codes contenant toutes les informations nécessaires à la validation d’une réservation. Dans ce QR code figure notamment le code “contremarque” qui est une chaîne de caractères permettant d’identifier la réservation et qui sert de preuve de réservation. Ce code unique est généré pour chaque réservation d'un utilisateur sur l'application et est transmis à cette occasion à l’utilisateur ;</li></br><li> - un webservice permettant de consulter la validité d’une réservation, et un second permettant de valider celle-ci. La validation d’une réservation a pour effet de prouver la réalisation du service proposé et engendre un remboursement selon les conditions prévues dans les CGU de la plateforme pass Culture.</li></ul>",
        externalDocs: {
          description: 'Find out more',
          url: 'http://swagger.io',
        },
      },
    ],
    paths: {
      '/bookings/token/{token}': {
        get: {
          tags: ['bookings'],
          summary: 'Vérifier une contremarque',
          description: 'A compléter',
          operationId: 'findBookingsByToken',
          produces: ['application/json'],
          parameters: [
            {
              name: 'token',
              in: 'path',
              description: 'Code contremarque de la réservation',
              required: true,
              style: 'simple',
              explode: false,
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'La contremarque existe et n’est pas validée',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Bookings',
                  },
                },
              },
            },
            '401': {
              description: ' L’API_KEY n’a pas été fournie dans la requête HTTP',
            },
            '403': {
              description: 'TO DO',
            },
            '404': {
              description: 'La contremarque n’existe pas',
            },
            '410': {
              description: 'La contremarque n’est plus valide car elle a déjà été validée',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Bookings: {
          type: 'object',
          properties: {
            bookingId: {
              type: 'string',
            },
            date: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            isUsed: {
              type: 'boolean',
            },
            offerName: {
              type: 'string',
            },
            userName: {
              type: 'string',
              description: 'le user name',
            },
            venueDepartementCode: {
              type: 'string',
            },
          },
          xml: {
            name: 'Bookings',
          },
        },
      },
      securitySchemes: {
        api_key: {
          type: 'apiKey',
          name: 'X-api-key',
          in: 'header',
        },
      },
    },
  },
]

export default swagger
