# itk-webshop-frontend

> ITK Webshop Frontend Project

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Local Setup
Just run `npm install` and then `npm run dev` to have it running on localhost:3000
Also change the api url to `https://api.schulting.com` in store/index.js for local development.
For production change api url to `https://api.labned.com`

## Build Steps
For staging:
`docker build . key2publish/itktest`
`docker push key2publish/itktest`

For production:
`docker build . key2publish/itk`
`docker push key2publish/itk`

After building and pushing, upgrade from rancher. Finalise if all works good, else rollback.

Make sure to put appropriate url in `store/index.js`

TODO: make the url in store/index.js be taken from process.env

