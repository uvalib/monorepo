export class VirgoAuth {


  static readonly authURL: string = "https://search.lib.virginia.edu/authorize"

  static async guestAuth() {
    const options = {
      method: "POST"
    }

    const data = await fetch(this.authURL, options)
    .then(r=>r.text())

    if (data !== undefined){
      return `Bearer ${data}`
    }
    return ""
  }

}