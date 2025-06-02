// import { createSanityClient } from "@/data/sanity";
// import { createQueryStore } from "@sanity/react-loader";

// export function useSanityHooks<T>() {
//   // const [client, setClient] = useState<any>(createSanityClient({}))
//   // useEffect(() => {
//   //   const buildClient = async () => {
//   //     let token = undefined;
//   //     try {
//   //       const session = await getSession();
//   //       // If we have a session, we validate it to get a token and make the query authorized. 
//   //       // If we have a session but it is not authorized, the hook will error.
//   //       // If we don't have a session, the hook will make the query unauthorized (token will be undefined).
//   //       if (session) {
//   //         const result = await fetch('/api/validate', {
//   //           method: 'POST',
//   //           body: JSON.stringify(session)
//   //         })
//   //         const body = await result.json();
//   //         token = body.token;
//   //       }

//   //       const queryOptions = getQueryOptions(token);
//   //       const client = createSanityClient(queryOptions);
//   //       setClient(client)


//   //     } catch (e) {
//   //       console.error(e)
//   //     }
//   //   }

//   //   buildClient();

//   // }, []);

//   const client = createSanityClient({token: "skoFYH5o2rP2gEfp0JwdsArZK8i0qYGAI3i4qsMZefM6TJtCpjRhlAjEA20jfsWemLbij4pfPQPbiIUW3HRz0b5UflBoeJJnp2s6EiIZHSA2p3spvBaZFpxo8iVl6qoIFNr1lUhC03FAbf8c3KUwNhNfsgmPusVQgDJ1pjDNUg0sPiQXJXTK", perspective: "drafts"})


//   const queryStore = createQueryStore({ client, ssr: false })
//   const useQuery = queryStore.useQuery
//   const useLiveMode = queryStore.useLiveMode
//   // const useLiveMode = isWeb() ? queryStore.useLiveMode : () => null

//   return { useQuery, useLiveMode, client, queryStore }
// }