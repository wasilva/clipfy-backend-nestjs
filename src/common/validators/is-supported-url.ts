import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { SUPPORTED_HOSTS, MAX_HOST_LENGTH, MAX_URL_LENGTH } from '../../config/platforms';

export function IsSupportedUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsSupportedUrl',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          if (value.length === 0 || value.length > MAX_URL_LENGTH) return false;
          let url: URL;
          try {
            url = new URL(value);
          } catch {
            return false;
          }
          if (url.protocol !== 'https:') return false;
          const host = url.hostname.toLowerCase();
          if (!host || host.length > MAX_HOST_LENGTH) return false;
          if (!SUPPORTED_HOSTS.has(host)) return false;
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid https URL from supported platforms`;
        },
      },
    });
  };
}

