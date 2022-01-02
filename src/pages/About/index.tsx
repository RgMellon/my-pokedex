import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

import { ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Load } from '../../components/Load';
import { CardAnimation } from '../../components/CardAnimated';

import api from '../../services/api';
import circle from '../../assets/img/circle.png';
import dots from './img/dots.png';

import * as S from './styles';
import { useTheme } from 'styled-components/native';

interface IAttributes {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface IAbilitys {
  ability: {
    name: string;
  };
}

type PokemonTypes = {
  type: {
    name:
      | 'grass'
      | 'fire'
      | 'water'
      | 'poison'
      | 'normal'
      | 'bug'
      | 'flying'
      | 'eletric'
      | 'ground';
  };
};

type PokemonProps = {
  id: number;
  name: string;
  stats: IAttributes[];
  abilities: IAbilitys[];
  types: PokemonTypes[];
  color: string;
};

type RouteParams = {
  pokemonId: number;
};

export function About() {
  const route = useRoute();
  const { colors } = useTheme();

  const { pokemonId } = route.params as RouteParams;
  const { goBack } = useNavigation();

  const [pokemon, setPokemon] = useState({} as PokemonProps);
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    async function getPokemonDetail(): Promise<void> {
      try {
        const response = await api.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
        );

        const { stats, abilities, id, name, types } = response.data;

        const currentType = types[0].type.name;

        const color = colors.backgroundCard[currentType];

        setPokemon({
          stats,
          abilities,
          id,
          name,
          types,
          color,
        });

        setLoad(false);
      } catch (err) {
        Alert.alert('Ops, ocorreu um erro, tente mais tarde');
      } finally {
        setLoad(false);
      }
    }

    getPokemonDetail();
  }, [pokemonId]);

  function navigateBack() {
    goBack();
  }

  return load ? (
    <S.LoadingScreen>
      <Load />
    </S.LoadingScreen>
  ) : (
    <ScrollView style={{ flex: 1 }}>
      <S.Header type={pokemon.types[0].type.name}>
        <S.BackButton onPress={navigateBack}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </S.BackButton>

        <S.ContentImage>
          <S.CircleImage source={circle} />
          <CardAnimation>
            <S.PokemonImage
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
              }}
            />
          </CardAnimation>
        </S.ContentImage>

        <S.Content>
          <S.PokemonId>#{pokemon.id}</S.PokemonId>
          <S.PokemonName>{pokemon.name}</S.PokemonName>
          <S.PokemonTypeContainer>
            {pokemon.types.map(({ type }) => (
              <S.PokemonType type={type.name} key={type.name}>
                <S.PokemonTypeText>{type.name}</S.PokemonTypeText>
              </S.PokemonType>
            ))}
          </S.PokemonTypeContainer>
        </S.Content>

        <S.DotsImage source={dots} />
      </S.Header>

      <S.Container>
        <S.Title type={pokemon.types[0].type.name}> Base States </S.Title>

        {pokemon.stats.map(attribute => (
          <S.StatusBar key={attribute.stat.name}>
            <S.Attributes>{attribute.stat.name}</S.Attributes>
            <S.AttributesNumber>{attribute.base_stat}</S.AttributesNumber>
            <S.ContentBar>
              <S.ProgressBar
                type={pokemon.types[0].type.name}
                borderWidth={0}
                progress={100}
                width={attribute.base_stat}
                color={pokemon.color}
              />
            </S.ContentBar>
          </S.StatusBar>
        ))}

        <S.Title type={pokemon.types[0].type.name}> Abilities </S.Title>
        {pokemon.abilities.map(abilityItem => (
          <S.Ability key={abilityItem.ability.name}>
            {abilityItem.ability.name}
          </S.Ability>
        ))}
      </S.Container>
    </ScrollView>
  );
}
