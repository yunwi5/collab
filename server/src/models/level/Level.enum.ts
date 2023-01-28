import { registerEnumType } from '@nestjs/graphql';

export enum LevelType {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  MASTER = 'Master',
}

registerEnumType(LevelType, {
  name: 'LevelType',
});

export const LevelKeyList = Object.keys(LevelType);

export const LevelTypeList = Object.values(LevelType);
