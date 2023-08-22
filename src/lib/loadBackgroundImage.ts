async function getRandomImage() {
  const apiKey = 'nKZ59J8oWk6HXQtKiczV19smt64tSVeR0gxsmnIzDnY';
  const apiUrl = 'https://api.unsplash.com/photos/random?client_id=' + apiKey;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const imageUrl = data.urls.regular;
      document.body.style.backgroundImage = `url('${imageUrl}')`;
  } catch (error) {
      console.error('Error fetching image:', error);
  }
}

getRandomImage();