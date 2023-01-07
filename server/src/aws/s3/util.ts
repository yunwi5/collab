import { isProduction } from 'src/utils';

export const getMulterDest = () => {
  return isProduction() ? '/tmp/s3' : './uploads';
};
