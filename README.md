# React Native x Sanity Visual Editing

This project is intended to provide a starting point for development of React Native apps that load data using the Sanity Client. 


## Dependencies/PreWork

#### IMPORTANT: This project assumes that wherever you have set up your Sanity Studio code, you have configured the "presentationTool" plugin with at least the following config: 

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
Where `locationResolver` is: 

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


Additionally, in order for the queries to succeed that are used for the example pages `"movies"` and `"people"`, it is assumed that you have done the following steps: 
1. Run `sanity init` in some repo (this or another, depending on where you want to manage your studio config)
2. When that init script asks you to chose a project template, you've chosen `Movie project (schema + sample data)`
3. When the init script asks `Add a sampling of sci-fi movies to your dataset on the hosted backend?`, you choose yes. 

Without these steps, the runtime of the React Native app itself shouldn't crash or have issues, but you won't see anything load on those test "movie" and "people" screens (feel free to remove them and update the nav if they are not needed).



## Get started

#### NOTE: pnpm is recommended, development using other package managers has not been rigorously tested.

1. Add a `.env.development.local` file using the same format as `.env.example`.

2. Install dependencies

   ```bash
   pnpm install
   ```


3. Start the app

   ```bash
   pnpm exec expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Other Notes

Several standard modules from Node that are part of the @sanity library but are not in the React Native runtime are shimmed using metro.config.js. Run the expo start command above with the `--clear` flag to clear the metro cache if you make additions/modifications to those shims for your own use case.