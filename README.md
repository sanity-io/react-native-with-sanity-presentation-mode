# React Native x Sanity Visual Editing

This project is intended to provide a starting point for development of React Native apps that load data using the Sanity Client. It is a monorepo that includes a workspace with a Vercel serverless API and an Expo React Native Project.

## Dependencies/PreWork

#### IMPORTANT: For the easiest starting point, this repo assumes that you have set up a Sanity project/studio and used the "Movies" starter template using the bootstrapping steps below.

#### Without the Sanity studio set up, the runtime of the React Native app itself shouldn't crash, but you won't see anything load on the test "movie" and "people" screens (feel free to remove them and update the nav if they are not needed, and in that case, you can set up a Sanity project/studio however you prefer and set the env file accordingly to point to that project -- see below).

**BOOTSTRAP STEPS FOR THE SANIY STUDIO (NOT FOR THIS REPO -- SEE Development SECTION BELOW):**
1. Run `sanity init` in some repo (preferably a separate repo but could be a folder in this repo or a monorepo etc, depending on how/where you want to manage your studio config).
2. When that init script asks you to choose a project template, choose `Movie project (schema + sample data)`.
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

## GOTCHAS (for this repo)
#### #1 -- PNPM Install + Expo
I've noticed that intermittently the pnpm install does not seem to install all of expo's dependencies (sometimes issue happens at install or at runtime) -- when I run into this, I generally just remove node_modules from the workspace root and workspaces, remove pnpm-lock.yaml, clear the pnpm cache (`pnpm cache delete`), and re-run `pnpm install`. This especially seems to happen if I run the "concurrently" script to start both workspaces without first running `pnpm start` in the expo_app workspace once. 

#### #2 -- Vercel Global Install
If not prevented, `vercel dev` uses its own version of typescript at runtime rather than the version in your dependencies. I've used `overrides` in pnpm-workspace.yaml to prevent this, but the project assumes you do not have a globally installed version of vercel (and instead will use `npx vercel COMMAND` to run things) -- it may work with a global version, but that is not tested. 

## Development

#### NOTE: pnpm is recommended, development using other package managers has not been rigorously tested.

#### Steps:
1. Create 3 Vercel projects, one for the root folder's vercel.json that does rewrites so you can serve the whole project from one domain (attach this to a project named how you want for that domain), one for Expo and one for the API.

2. Link the root directory and each workspace to its corresponding vercel project (use `npx vercel link` in each directory and follow the prompts).

3. In the Vercel Console add the following env vars: 
    #### API Project Env Vars:
    Configure all env variables in Vercel for the Development, Preview, and Production envs in the Project -> Settings -> Environment Variables console
    For local dev in the "vercel_api" workspace, `npx vercel dev` will auto-load the Development env into memory, so you don't need to do anything
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

    #### Expo Project Env Vars
    For local dev or local native builds in the "expo_app" workspace, run "npx vercel env pull" from the expo_app directory to generate a .env.local file that Expo can use
    For deployed Expo web app, Vercel should pick up the Production env from the Vercel console
    For deployed Expo native builds, you'll need to set the same env variables in the Expo project console!

    Vars:

    ```
    EXPO_PUBLIC_SANITY_PROJECT_ID=project_id
    EXPO_PUBLIC_SANITY_DATASET=dataset_name
    EXPO_PUBLIC_SANITY_STUDIO_URL=studio_url_localhost_or_deployed
    EXPO_PUBLIC_API_BASE_URL=base_url_of_api_that_serves_/api/validate_route
    ```

4. Install dependencies
 
    From the project root run:
   ```
   pnpm install
   ```

5. Run `pnpm start` from the "expo_app" workspace to set up expo for the first time (for some reason running it from the monorepo root seems to cause Gotcha #2, see above). Once expo is up and running (verify in the browser at localhost:8081), you can quit this process. You should ONLY need to do this step on a fresh install (after repo clone or after resolving Gotcha #2, see above).

6. Start the API and app concurrently in the same terminal window:
  
    From the project root, run
   ```
   pnpm start
   ```
    **Notes** 
    - You can run also run the workspaces individually in 2 separate terminal windows if you prefer, by running `pnpm start` from each workspace directory, one in each terminal window. 
    - When using the monorepo's main `start` command, Expo will receive standard input, not the API (to allow you to use the hotkeys that control Expo Go).
    - If you see an error warning in Cursor/VSCode expo_app/tsconfig.json about `expo/tsconfig.base` not existing, and you have already run the start command for the monorepo or expo by itself (see below), sometimes you need to restart Cursor/VSCode (the IDE seems to have issues picking up the fact that expo starting up clears that error).



5. **The main goal of this repo is to open the Expo app INSIDE of Sanity Studio, so once you have started up the vercel_api and expo_app, start the Sanity Studio with Presentation plugin that you set up in the steps above (start it up from its repo/directory -- the studio code is not present in this codebase), visit `http://localhost:3333`, and click the Presentation tab in the local Studio.**

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
In this codebase, I've set the projet up to deploy the expo_app workspace and the vercel_api workspace to Vercel hosting and Vercel serverless functions, respectively. 

The deploy command (run from the project root) is: 
```
pnpm deploy:production
```

I've configured the web app's vercel.json to add a correct CSP header that allows my own sanity studio URL to load this web app in an iframe (see vercel.json). Update the CSP header rewrite in vercel.json to use your own studio URL or refactor the codebase to use a different hosting service (see warning above about Expo Hosting and Presentation mode -- incompatible at this time due to configuration constraints in Expo).

Update any URLs in the Studio's project CORS origins accordingly. Any host that wants to query your project has to be allowed in those project CORS settings -- credentials need to be allowed if that host wants to pass a Sanity authorization token as part of that query (see Token Management below).

## Token Management
DO NOT STORE A SANITY TOKEN IN ANY FRONT END -- IT IS AN API KEY. A non-persistent "session" key is received as a query parameter from the Presentation plugin when it loads its configured "enable" page route. In this project, that session key is then exchanged for a token via the `api/validate` vercel serverless function.

## Other Notes
Several standard modules from Node that are part of the @sanity library but are not in the React Native runtime are shimmed using metro.config.js. Run the expo start command above with the `--clear` flag to clear the metro cache if you make additions/modifications to those shims for your own use case.