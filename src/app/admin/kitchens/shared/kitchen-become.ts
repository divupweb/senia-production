export class KitchenBecome {
  service;
  state;
  router;
  auth;
  toast;

  becomeKitchen(id, event) {
    if (event) event.preventDefault();
    this.service.submitFakeLogin(id).subscribe(
      (data) => {
        this.state.set('current', data.user);
        this.state.set('kitchen', data.kitchen);
        let link = this.auth.getLink();
        this.router.navigate(link)
      },
      (error) => this.toast.error(error)
    );
  }
}
