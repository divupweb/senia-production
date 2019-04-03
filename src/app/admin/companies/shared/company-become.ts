export class CompanyBecome {
  service;
  state;
  router;
  auth;
  toast;

  becomeCompany(id, event) {
    if (event) event.preventDefault();
    this.service.submitFakeLogin(id).subscribe(
      (data) => {
        this.state.set('current', data.user);
        this.state.set('company', data.company);
        let link = this.auth.getLink();
        this.router.navigate(link);
      },
      (error) => {
        this.toast.error(error);
      }
    );
  }
}
