const BASE_URL = 'https://example.com';

export async function getAllUsers() {
  const response = await fetch(`${BASE_URL}/User/GetAllUsers`);
  if (!response.ok) {
    throw new Error('Kullanıcılar getirilemedi');
  }
  return await response.json();
}

export async function getDeletedUsers() {
  const response = await fetch(`${BASE_URL}/User/GetDeletedUsers`);
  if (!response.ok) {
    throw new Error('Silinmiş kullanıcılar getirilemedi');
  }
  return await response.json();
}

export async function getUserById(id) {
  const response = await fetch(`${BASE_URL}/User/GetKisiWithID?id=${id}`);
  if (!response.ok) {
    throw new Error('Kullanıcı bulunamadı');
  }
  return await response.json();
}
