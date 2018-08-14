export default function (context) {
  var ip = (context.req.headers['x-forwarded-for'] !== undefined) ? context.req.headers['x-forwarded-for'] : context.req.connection.remoteAddress
  context.ip = ip
}
