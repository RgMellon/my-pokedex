import React, { useState, useEffect } from 'react';

import { ScrollView, ActivityIndicator } from 'react-native';

import pokeballImage from '../../assets/img/pokeball.png';
import pokeballCardImage from '../../assets/img/pokeballCard.png';
import dotsImage from '../../assets/img/dots.png';

import api from '../../services/api';

import * as S from './styles';

type PokemonType = {
  type: {
    name: string;
  };
};

export interface Pokemon {
  name: string;
  url: string;
  id: number;
  types: PokemonType[];
}

export interface Request {
  id: number;
  types: PokemonType[];
}

export function Home() {
  const [load, setLoad] = useState<boolean>(true);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    async function getPokemons(): Promise<void> {
      const response = await api.get('/pokemon');
      const { results } = response.data;

      const payloadPokemons = await Promise.all(
        results.map(async (pokemon: Pokemon) => {
          const { id, types } = await getMoreInfoAboutPokemonsByUrl(
            pokemon.url,
          );

          return {
            name: pokemon.name,
            id,
            types,
          };
        }),
      );

      setPokemons(payloadPokemons as Pokemon[]);
      setLoad(false);
    }

    getPokemons();
  }, []);

  async function getMoreInfoAboutPokemonsByUrl(url: string): Promise<Request> {
    const response = await api.get(url);

    const { id, types } = response.data as Request;

    return { id, types };
  }

  return load ? (
    <S.LoadingScreen>
      <ActivityIndicator size="large" color="#d6d6d6" />
    </S.LoadingScreen>
  ) : (
    <ScrollView>
      <S.Header source={pokeballImage} />

      <S.Container>
        <S.Title> Pokédex</S.Title>
        <S.PokemonList
          data={pokemons}
          keyExtractor={pokemon => pokemon.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: pokemon }) => (
            <S.PokemonCard type={pokemon.types[0].type.name} onPress={() => {}}>
              <S.LeftSide>
                <S.PokemonId>#{pokemon.id}</S.PokemonId>
                <S.PokemonName>{pokemon.name}</S.PokemonName>
                <S.ImageCardDetailLeftSide source={dotsImage} />
                <S.PokemonContentType>
                  {pokemon.types.map(pokemonType => (
                    <S.PokemonType
                      key={pokemon.id}
                      type={pokemonType.type.name}
                    >
                      <S.PokemonTypeText>
                        {pokemonType.type.name}
                      </S.PokemonTypeText>
                    </S.PokemonType>
                  ))}
                </S.PokemonContentType>
              </S.LeftSide>

              <S.RightSide>
                <S.PokeballCardDetail source={pokeballCardImage} />
                <S.PokemonImage
                  source={{
                    uri: `https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`,
                  }}
                />
              </S.RightSide>
            </S.PokemonCard>
          )}
        />
      </S.Container>
    </ScrollView>
  );
}
