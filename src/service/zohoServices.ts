import { addSeconds } from 'date-fns';
import { AppDataSource } from '../dbconfig';
import { Token } from '../entites/Token';
import axios from 'axios';
import { FormApiData, FormStatus } from '../entites/FormApiData';



const getAccessTokenFromCode = async (code: string) => {
  try {
    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        client_id: '1000.09VD6CTYW5K5H6LM1XGW17JL8XTMYH',
        client_secret: '294253be0dad08cac0ef41a4881ca0bf66afcf23e7',
        grant_type: 'authorization_code',
        code: code,
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;
    return { access_token, refresh_token, expires_in };
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error);
    throw error;

  }
};

const saveToken = async (accessToken: string, refreshToken: string, expiresIn: number) => {
  try {

    const tokenRepository = AppDataSource.getRepository(Token);
    const token = new Token();
    token.accessToken = accessToken;
    token.refreshToken = refreshToken;
    token.tokenExpiresAt = addSeconds(new Date(), expiresIn).getTime();
    await tokenRepository.save(token);
  } catch (error) {
    console.error('error saving token:', error);
    throw error;
  }
};
const getToken = async () => {
  try {
    const tokenRepository = AppDataSource.getRepository(Token);
    const token = await tokenRepository.findOne({ where: { id: 1 }, order: { id: 'DESC' } });
    return token;
  }
  catch (error) {
    console.error('Error fetching Token', error);
    throw error;
  }
};

const refreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        client_id: '1000.09VD6CTYW5K5H6LM1XGW17JL8XTMYH',
        client_secret: '294253be0dad08cac0ef41a4881ca0bf66afcf23e7',
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, expires_in } = response.data;
    const tokenExpiresAt = addSeconds(new Date(), expires_in).getTime();

    const tokenRepository = AppDataSource.getRepository(Token);
    let token = await tokenRepository.findOne({ where: { refreshToken } });
    if (token) {
      token.accessToken = access_token;
      token.tokenExpiresAt = tokenExpiresAt;
      await tokenRepository.save(token);
    }

    return { accessToken: access_token, tokenExpiresAt: token?.tokenExpiresAt };
  }
  catch (error) {
    console.log('error refreshing token', error);
    throw new Error('failed to refresh token');
  }
};
export const updateFormStatus = async(id: number, status:FormStatus) => {
  const formApiDataRepository = AppDataSource.getRepository(FormApiData);
  const form = await formApiDataRepository.findOne({where:{ id }});

  if(form){
      form.status = status;
      await formApiDataRepository.save(form);
  }
  else{
    console.error(`Form with id ${id} not found`);
  }
};

export default {
  saveToken,
  getToken,
  refreshToken,
  getAccessTokenFromCode,
};