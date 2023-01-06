import { registerEnumType } from '@nestjs/graphql';

export enum VoteType {
  UP = 'up',
  DOWN = 'down',
}

registerEnumType(VoteType, {
  name: 'VoteType',
});
