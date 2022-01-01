import * as yup from 'yup';
import { translatedErrors } from '@strapi/helper-plugin';

const schema = yup.object().shape({
  channel: yup
    .string()
    .required(translatedErrors.required),
  text: yup
    .string()
    .required(translatedErrors.required),
});

export default schema;
