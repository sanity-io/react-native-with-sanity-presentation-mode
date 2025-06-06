# React Native x Sanity Visual Editing

This project is intended to provide a starting point for development of React Native apps that load data using the Sanity Client. 


## Dependencies/PreWork

#### IMPORTANT: For the easiest starting point, this repo assumes that you have set up a Sanity project/studio and used the "Movies" starter template using the bootstrapping steps below.

#### Without the Sanity studio set up, the runtime of the React Native app itself shouldn't crash, but you won't see anything load on the test "movie" and "people" screens (feel free to remove them and update the nav if they are not needed, and in that case, you can set up a Sanity project/studio however you prefer and set the env file accordingly to point to that project -- see below).

**BOOTSTRAP STEPS:**
1. Run `sanity init` in some repo (preferably a separate repo but could be a folder in this repo or a monorepo etc, depending on how/where you want to manage your studio config)
2. When that init script asks you to chose a project template, you've chosen `Movie project (schema + sample data)`
3. When the init script asks `Add a sampling of sci-fi movies to your dataset on the hosted backend?`, you choose yes. 
4. Make sure that in that project's "API" tab on https://manage.sanity.io, you've added the following hosts to the allowed CORS origins (WITH credentials allowed if your front end queries will pass a Sanity token, see Token Management below):  
- `http://localhost:8081` (or whatever host/port you run the React Native app on) 
- `http://localhost:3333` (or whatever host/port you run your Sanity Studio on)
5. Added the sanity/presentation npm library to whichever repo and in that repo add the following config to the "plugins" section of your sanity.config.ts/js: 
```
 presentationTool({
      resolve: locationResolver,
      previewUrl: {
        origin: 'http://localhost:8081',
        previewMode: {
          enable: '/preview-mode/enable',
          disable: '/preview-mode/disable',
        },
      },
    })
```
where the locationResolver is defined as: 
```
const locationResolver = {locations: {
  // Resolve locations using values from the matched document
  movie: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: 'Movies Directory',
          href: '/movies',
        },
        {
          title: `Movie Page: ${doc?.title}`,
          href: `/movie/${doc?.slug}`,
        },
      ],
    }),
  }),
  person: defineLocations({
    select: {
      name: 'name',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: 'People Directory',
          href: '/people',
        },
        {
          title: `Person Page: ${doc?.name}`,
          href: `/person/${doc?.slug}`,
        },
      ],
    }),
  }),
}}

```

To view the source repo of the sanity studio that was used to develop this application, see this [Github Repo](https://github.com/codebravotech/react-native-with-sanity-presentation-mode-studio). Note that you could also clone and spin up this repo, but you would not have any test data configured, so you'd have to add a few test documents each of types Movie and Person.


## Development

#### NOTE: pnpm is recommended, development using other package managers has not been rigorously tested.

#### Steps:

1. Setup your environment in the Vercel Console:
    #### API Env Vars:
    Configure all env variables in Vercel for the Development, Preview, and Production envs in the Project -> Settings -> Environment Variables console
    For local dev in the "api" workspace, `vercel dev` will auto-load the Development env into memory, so you don't need to do anything
    #For deployed API, Vercel should pick up the Production env from the Vercel console
    Note that for Development you can leave PRIVATE_SANITY_VIEWER_TOKEN as a regular var (sensitive not supported for Development),
    but in Preview/Production it should be set to sensitive to avoid being bundled with any FE code

    Vars:

    ```
    SANITY_PROJECT_ID=project_id
    SANITY_DATASET=dataset_name
    SANITY_STUDIO_URL=studio_url_localhost_or_deployed
    BASE_URL=base_url_of_this_app_localhost_or_deployed
    PRIVATE_SANITY_VIEWER_TOKEN=Add your sanity viewer token from manage.sanity.io (go to project settings then API tab).
    ```

    #### Expo Env Vars
    For local dev or local native builds in the "expo" workspace, run "npx vercel env pull" from the expo directory to generate a .env.local file that Expo can use
    For deployed Expo web app, Vercel should pick up the Production env from the Vercel console
    For deployed Expo native builds, you'll need to set the same env variables in the Expo project console!

    Vars:

    ```
    EXPO_PUBLIC_SANITY_PROJECT_ID=project_id
    EXPO_PUBLIC_SANITY_DATASET=dataset_name
    EXPO_PUBLIC_SANITY_STUDIO_URL=studio_url_localhost_or_deployed
    EXPO_PUBLIC_API_BASE_URL=base_url_of_api_that_serves_/api/validate_route
    ```

2. Install dependencies
 
    From the project root run:
   ```
   pnpm install
   ```

3. Run `vercel init` from each of your workspace directories to link each workspace to your Vercel project.

4. Start the API and app concurrently in the same terminal window:
  
    From the project root, run
   ```
   pnpm start
   ```
   You can also run the workspaces individually in 2 separate terminal windows if you prefer, by running `pnpm start` from each workspace directory, one in each terminal window.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

**However, the main goal is to open the app INSIDE of Sanity Studio, so run the Sanity Studio with Presentation plugin that you set up in the steps above, visit `http://localhost:3333`, and click the Presentation tab in the studio.**

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Deployment
#### DON'T DEPLOY THE EXPO WEB APP ON EXPO HOSTING -- Expo hosting adds a Content Security Policy header by default that prevents the Sanity Studio from loading the Expo web app in an iframe. Deploy instead to Vercel, Netlify, or another service that allows you to customize that header. You can/should still build your actual native device/simulator builds using Expo. 

### Shared Setup for Native and Web App builds (app.json)
Make sure to change the projectId in app.json to your own project's ID.

In this project, the single API is a Vercel serverless function (see Web Deployments below), but you could change it to be in AWS lambda, GCP function, etc if you choose. That API is used for session key validation (see Token Management below).

### Native/Simulator Builds
Make an Expo project in the Expo dashboard.

Follow Expo's guides building for iOS simulator, iOS, Android, etc and chosen environment (development, preview, production, etc), depending on your use case.  (This project was built successfully as a preview build for iOS simulator, so it should work for at least that use case). 

### Web Deployments
In this codebase, I've set the projet up to deploy the expo web app workspace and the api workspace to Vercel hosting and Vercel serverless functions respectively. I've configured the web app's vercel.json to add a correct CSP header that allows my own sanity studio URL to load this web app in an iframe (see vercel.json). Update the CSP header rewrite in vercel.json to use your own studio URL or refactor the codebase to use a different hosting service (see warning above about Expo Hosting and Presentation mode -- incompatible at this time due to configuration constraints in Expo).

Update any URLs in the Studio's project CORS origins accordingly. Any host that wants to query your project has to be allowed in those project CORS settings -- credentials need to be allowed if that host wants to pass a Sanity authorization token as part of that query (see Token Management below).

## Token Management
DO NOT STORE A SANITY TOKEN IN ANY FRONT END -- IT IS AN API KEY. A non-persistent "session" key is received as a query parameter from the Presentation plugin when it loads its configured "enable" page route. In this project, that session key is then exchanged for a token via the `api/validate` serverless expo function.

## Other Notes
Several standard modules from Node that are part of the @sanity library but are not in the React Native runtime are shimmed using metro.config.js. Run the expo start command above with the `--clear` flag to clear the metro cache if you make additions/modifications to those shims for your own use case.