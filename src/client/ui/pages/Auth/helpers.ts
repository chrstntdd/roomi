import { Success, Failure } from 'folktale/validation';

import { capitalizeFirstChar } from '@/util';

// Eventually these validators can be moved out into their own top-level directory

export const validEmail = (value: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  )
    ? Success(value)
    : Failure(['Please enter a valid email']);

export const notEmpty = (field, value) =>
  value && value.trim()
    ? Success(value)
    : Failure([`${capitalizeFirstChar(field)} can't be empty`]);

export const minLength = (field: string, min: number, value: string) =>
  value && value.length > min
    ? Success(value)
    : Failure([`${capitalizeFirstChar(field)} must have at least ${min} characters`]);

export const isValidEmail = emailValue =>
  Success()
    .concat(notEmpty('email', emailValue))
    .concat(validEmail(emailValue))
    .map(_ => emailValue);

export const isValidPassword = passwordValue =>
  Success()
    .concat(notEmpty('password', passwordValue))
    .concat(minLength('password', 6, passwordValue))
    .map(_ => passwordValue);

export const validateSignUpForm = formValues =>
  Success()
    .concat(isValidEmail(formValues.email))
    .concat(isValidPassword(formValues.password))
    .map(_ => formValues);
