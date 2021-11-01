import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { InMemoryCache, ApolloClient, gql } from '@apollo/client'
import { useState } from 'react'
import {
  Heading,
  Input,
  Stack,
  IconButton,
  Box,
  Flex,
  useToast,
} from "@chakra-ui/react";

import Character from '../components/Character'
import { SearchIcon, CloseIcon } from "@chakra-ui/icon";

export default function Home(res) {
  const toast = useToast();
  const initState = res
  const [search, setSearch] = useState("");
  const [characters, setCharacters] = useState(res.Characters)
  console.log(characters);
  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const results = await fetch("/api/SearchCharacters", {
            method: "post",
            body: search,
          });
          const { characters, error } = await results.json();
          if (error) {
            toast({
              position: "bottom",
              title: "An error occurred.",
              description: error,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else {
            setCharacters(characters);
          }
        }}
      >
        <Stack maxWidth="350px" width="100%" isInline mb={8}>
          <Input
            placeholder="Search"
            value={search}
            border="none"
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
          {/* <IconButton
            colorScheme="blue"
            aria-label="Search database"
            icon={<SearchIcon />}
            disabled={search === ""}
            type="submit"
          /> */}
          {/* <IconButton
            colorScheme="red"
            aria-label="Reset "
            icon={<CloseIcon />}
            disabled={search === ""}
            onClick={async () => {
              setSearch("");
              setCharacters(initState.Characters);
            }}
          /> */}
        </Stack>
      </form>
      <Character characters={characters} />
    </div>
  )
}


export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql",
    cache: new InMemoryCache()
  })

  const { data } = await client.query({
    query: gql`
      query{
        characters(page : 1){
          info{
            count
            pages
          }
          results{
            name
            id
            location{
              id
              name
            }
            origin{
              id
              name
            }
            episode{
              id
              episode 
              air_date
            }
            image
          }
        } 
      }
    `,
  });

  return {
    props: {
      Characters: data.characters.results,
    },
  };

}

// export default client
