export class VirgoAuth {
  guestToken: string;

  readonly authURL: string = "https://search-dev.lib.virginia.edu/authorize"

  constructor(){
    this.guestToken = VirgoAuth.guestAuth();
  }

  static guestAuth(): string {

    return "";
  }

}