import {TUpdateUserInformation, TUserInformation} from '../types/user';

export function toEditForm(info: TUserInformation | null) {
  return {
    name: info?.name ?? '',
    location: info?.state ?? '',
    age: info?.age?.toString() ?? '',
  };
}

export function toUpdatePayload(
  name: string,
  location: string,
  age: string,
): TUpdateUserInformation {
  return {
    name: name.trim(),
    ubication: location.trim(),
    age: age.trim(),
  };
}

export function payloadToUserPatch(
  payload: TUpdateUserInformation,
): Partial<TUserInformation> {
  return {
    name: payload.name,
    state: payload.ubication,
    age: payload.age,
  };
}
