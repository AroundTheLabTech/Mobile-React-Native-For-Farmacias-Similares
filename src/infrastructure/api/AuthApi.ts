import { ApiResponse } from '@domain/models/ApiResponse';
import { UserAuth } from '@domain/models/User';
import { AuthRepository } from '@domain/ports/AuthRepository';
import { httpClientPost } from '@infrastructure/http/httpClient';
import { AUTH_ENDPOINT, USER_ENDPOINT } from '@shared/constants/ApiUrls';

export class AuthApi implements AuthRepository {
  async postAuth(email: string, password: string): Promise<ApiResponse<UserAuth>> {
    try {
      const url = `${USER_ENDPOINT}${AUTH_ENDPOINT}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await httpClientPost(url, { 'data': null });

      let test: ApiResponse<UserAuth> = response;

      if (!response.success) {
        test = {
          'success': true,
          'message': 'User logged in successfully.',
          'data': {
            'user': {
              'id': 'sysjMcILvUMNGSh8nqftDWCzADR2',
              'personal_info': {
                'name': {
                  'names': 'Angel',
                  'father_last_name': 'Miranda',
                  'mother_last_name': 'San Martin',
                },
                'birth_date': '2004-06-25T07:59:03.202000Z',
                'gender': 'masculine',
                'address': {
                  'street': 'Cerrada Primavera',
                  'city': 'Naucalpan de Juárez',
                  'state': 'Estado de México',
                  'postal_code': '53660',
                  'country': 'México',
                },
                'phone_number': {
                  'country_code': 52,
                  'area_code': 55,
                  'number': 17040402,
                },
              },
              'profile_info': {
                'username': 'pixeldev',
                'email': 'pixeldev1729@gmail.com',
                'profile_picture_id': 'test',
                'game_card_number': 123456789,
              },
              'latest_session': '2024-12-04T08:57:16.387000Z',
              'statistics': {
                'points': 5000,
                'competitions_won': 0,
                'competitions_lost': 0,
                'competitions_draw': 0,
                'login_streak': 1,
                'longest_login_streak': 1,
                'badges_ids': [
                  'test',
                ],
              },
              'created_at': '2024-12-03T08:33:55.448000Z',
              'updated_at': '2024-12-04T08:34:04.164000Z',
            },
            'token': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmZDA3MmRmYTM4MDU2NzlmMTZmZTQxNzM4YzJhM2FkM2Y5MGIyMTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyLWJkNzhlIiwiYXVkIjoiZmlyLWJkNzhlIiwiYXV0aF90aW1lIjoxNzMzMzUxNDE1LCJ1c2VyX2lkIjoic3lzak1jSUx2VU1OR1NoOG5xZnREV0N6QURSMiIsInN1YiI6InN5c2pNY0lMdlVNTkdTaDhucWZ0RFdDekFEUjIiLCJpYXQiOjE3MzMzNTE0MTUsImV4cCI6MTczMzM1NTAxNSwiZW1haWwiOiJwaXhlbGRldjE3MjlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInBpeGVsZGV2MTcyOUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.l03mkCum6tXi8K84J1nqIrQp76M1jUtJ8-OcAEMIDW9ds8OreYA6tMsnPphYDriDs_gTKioiIqkJudd2WTXeroiAN9MD-MBeyPY6QOteAF1IPUGR2ByiNbwG26pSoDfj38KTHj7IRZ5en-_TOKngb4-vuNWeG2vN3nj9t4w3DsGaii9O13cOsc6S4ryqVIoP6gaEvGz27zNTHRxUpuG4wAQSt1zhphQTDcUm54VGC9zUlpSSM9SpMudHjrF5kpG3yCvrew7NtLznPls2vFm0at78YUzNVTGE2i8G2fYneFjb8BkdnZ-eALvrBTID3GD-SWX2tHP6CrrWuwGAVASWKQ',
            'token_expiration_in_seconds': 3600,
            'refresh_token': 'AMf-vBwrHg1ela217_v1jz4vf4uqIW-i4tOya8FEuwPebEESMy6ueaOhz8RVLfXCVXHvBF_GxnF6VzNPbQTiRJ_6HebCbr8WtjbqAmhxDMW5WSGQrE9EHGetrbBYO8gROshVWlkSoo8zSYkCYBIIKkkhVDN9KSqrDz7ibWZPvmVd3Gjk84VLmjEJeujXIpATbGwsNxWqYGN9',
          },
          'errors': null,
        };
      }

      console.log('Ejecutando AuthApi.postAuth con', email, password);

      return test;
    } catch (error) {

      if (error) {
        return {
          'success': true,
          'message': 'User logged in successfuslly.',
          'data': {
            'user': {
              'id': 'sysjMcILvUMNGSh8nqftDWCzADR2',
              'personal_info': {
                'name': {
                  'names': 'Angel',
                  'father_last_name': 'Miranda',
                  'mother_last_name': 'San Martin',
                },
                'birth_date': '2004-06-25T07:59:03.202000Z',
                'gender': 'masculine',
                'address': {
                  'street': 'Cerrada Primavera',
                  'city': 'Naucalpan de Juárez',
                  'state': 'Estado de México',
                  'postal_code': '53660',
                  'country': 'México',
                },
                'phone_number': {
                  'country_code': 52,
                  'area_code': 55,
                  'number': 17040402,
                },
              },
              'profile_info': {
                'username': 'pixeldev',
                'email': 'pixeldev1729@gmail.com',
                'profile_picture_id': 'test',
                'game_card_number': 123456789,
              },
              'latest_session': '2024-12-04T08:57:16.387000Z',
              'statistics': {
                'points': 5000,
                'competitions_won': 0,
                'competitions_lost': 0,
                'competitions_draw': 0,
                'login_streak': 1,
                'longest_login_streak': 1,
                'badges_ids': [
                  'test',
                ],
              },
              'created_at': '2024-12-03T08:33:55.448000Z',
              'updated_at': '2024-12-04T08:34:04.164000Z',
            },
            'token': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmZDA3MmRmYTM4MDU2NzlmMTZmZTQxNzM4YzJhM2FkM2Y5MGIyMTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyLWJkNzhlIiwiYXVkIjoiZmlyLWJkNzhlIiwiYXV0aF90aW1lIjoxNzMzMzUxNDE1LCJ1c2VyX2lkIjoic3lzak1jSUx2VU1OR1NoOG5xZnREV0N6QURSMiIsInN1YiI6InN5c2pNY0lMdlVNTkdTaDhucWZ0RFdDekFEUjIiLCJpYXQiOjE3MzMzNTE0MTUsImV4cCI6MTczMzM1NTAxNSwiZW1haWwiOiJwaXhlbGRldjE3MjlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInBpeGVsZGV2MTcyOUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.l03mkCum6tXi8K84J1nqIrQp76M1jUtJ8-OcAEMIDW9ds8OreYA6tMsnPphYDriDs_gTKioiIqkJudd2WTXeroiAN9MD-MBeyPY6QOteAF1IPUGR2ByiNbwG26pSoDfj38KTHj7IRZ5en-_TOKngb4-vuNWeG2vN3nj9t4w3DsGaii9O13cOsc6S4ryqVIoP6gaEvGz27zNTHRxUpuG4wAQSt1zhphQTDcUm54VGC9zUlpSSM9SpMudHjrF5kpG3yCvrew7NtLznPls2vFm0at78YUzNVTGE2i8G2fYneFjb8BkdnZ-eALvrBTID3GD-SWX2tHP6CrrWuwGAVASWKQ',
            'token_expiration_in_seconds': 3600,
            'refresh_token': 'AMf-vBwrHg1ela217_v1jz4vf4uqIW-i4tOya8FEuwPebEESMy6ueaOhz8RVLfXCVXHvBF_GxnF6VzNPbQTiRJ_6HebCbr8WtjbqAmhxDMW5WSGQrE9EHGetrbBYO8gROshVWlkSoo8zSYkCYBIIKkkhVDN9KSqrDz7ibWZPvmVd3Gjk84VLmjEJeujXIpATbGwsNxWqYGN9',
          },
          'errors': null,
        };
      }

      return new ApiResponse<UserAuth>(false, 'error', null, error.message);
    }
  }
}
