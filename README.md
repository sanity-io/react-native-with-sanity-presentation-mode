# React Native x Sanity Visual Editing

This project is intended to provide a starting point for development of React Native apps that load data using the Sanity Client. 

In order for the queries to succeed that are used for the example pages `"movies"` and `"people"`, it is assumed that you have done the following steps: 
1. Run `sanity init` in some repo (this or another, depending on where you want to manage your studio config)
2. When that init script asks you to chose a project template, you've chosen `Movie project (schema + sample data)`
3. When the init script asks `Add a sampling of sci-fi movies to your dataset on the hosted backend?`, you choose yes. 

Without these steps, the runtime of the React Native app itself shouldn't crash or have issues, but you won't see anything load on those test screens (feel free to remove them and update the nav if they are not needed).

## Get started

#### NOTE: pnpm is recommended, development using other package managers has not been rigorously tested.

1. Install dependencies

   ```bash
   pnpm install
   ```


2. Start the app

   ```bash
   pnpm exec expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

Note the use of shims for several standard modules from Node that are not part of the React Native runtime -- see metro.config.js. Run the expo start command above with the `--clear` flag to clear the metro cache if you make additions to those shims for your own use case.