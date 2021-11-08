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

const deleteButtons = document.querySelectorAll('.delete-meal');
const deleteRestaurantButton = document.querySelector('.delete-restaurant');

if (deleteRestaurantButton) {
  deleteRestaurantButton.addEventListener('click', (e: Event) => {
    const confirmation = window.confirm('Are you sure you want to delete this restaurant and all meals?');

    if (confirmation) {
      // This imitatas <a href=''></a>, fetch doesn't reload page so the flashes are not visible.
      window.location.replace(`/delete/${(e.target! as HTMLElement).dataset!.id}`);
    }
  });
}

if (deleteButtons.length) {
  deleteButtons.forEach((button) => button.addEventListener('click', () => {
    const confirmation = window.confirm('Are you sure you want to delete this meal?');

    if (confirmation) {
      // This imitatas <a href=''></a>, fetch doesn't reload page so the flashes are not visible.
      window.location.replace(`/delete-meal/${(button as HTMLElement).dataset.id}`);
    }
  }));
}
