function autocompleteInit(): void {
  const restaurantInput = document.querySelector('#restaurant') as HTMLInputElement;
  const readableAddress = document.querySelector('#address') as HTMLInputElement;
  const lngInput = document.querySelector('#lng') as HTMLInputElement;
  const latInput = document.querySelector('#lat') as HTMLInputElement;

  if (!restaurantInput || !lngInput || !latInput || !readableAddress) return;

  // eslint-disable-next-line no-undef
  const autocomplete = new google.maps.places.Autocomplete(restaurantInput);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    readableAddress.value = place.formatted_address!;
    lngInput.value = String(place.geometry?.location?.lng());
    latInput.value = String(place.geometry?.location?.lat());
  });

  restaurantInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.keyCode === 13) e.preventDefault();
  });
}

autocompleteInit();
