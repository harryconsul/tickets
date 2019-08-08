/* 
*  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
*  See LICENSE in the source repository root for complete license information. 
*/
import { Client } from "@microsoft/microsoft-graph-client";
import {history} from './history';
const getBlobUrl = async (response) => {
  if (response) {
    const blob = await response.blob();
    try {
      const url = window.URL || window.webkitURL;
      const blobUrl = url.createObjectURL(blob);
      return blobUrl;

    } catch (e) {
      throw (e);
    }
  }else{
    throw({msg:"Error"});
  }

}
export default class GraphSdkHelper {
  constructor(token) {

    // Initialize the Graph SDK.
    this.client = Client.init({
      debugLogging: true,
      authProvider: (done) => done(null, token),
    });

    this._handleError = this._handleError.bind(this);

  }

  // GET me
  getMe(callback) {
    this.client
      .api('/me')
      .select('displayName')
      .get((err, res) => {
        if (!err) {
          callback(null, res);
        }
        else this._handleError(err);
      });
  }

  getMyProfile(callback) {
    this.client
      .api('/me')
      .select('id', 'displayName', 'department', 'mail', 'mobilePhone', 'businessPhones', 'jobTitle')
      .get((err, res) => {

        if (!err) {

          callback(null, res);
        }
        else this._handleError(err);
      }).catch(reason => {
        console.log(reason);
      });
  }

  //.api('/me/photo/$value')
  getMyPicture(callback) {
    this.client
      .api('/me/photos/64X64/$value')
      .header('Cache-Control', 'no-cache')
      .responseType('blob')
      .get((err, res, rawResponse) => {
        getBlobUrl(rawResponse)
          .then(url => callback(null, url))
          .catch(reason => callback(reason, null))
      });

  }

  // GET me/people
  //'id', 'displayName', 'department', 'mail', 'mobilePhone', 'businessPhones', 'jobTitle'
  //'id,displayName,givenName,surname,emailAddresses,userPrincipalName,department,'
  /*getPeople(callback) {
    this.client
      .api('/me/people')
      .version('beta')
      .filter(`personType eq 'Person'`)
      .select('id,displayName,givenName,surname,emailAddresses,userPrincipalName,department')
      .top(5)
      .get((err, res) => {
        if (err) {
          this._handleError(err);
        }
        callback(err, (res) ? res.value : []);
      });
  }
  */
  getPeople(callback) {
    this.client
      .api('/me/people')
      .version('beta')
      .filter(`personType eq 'Person'`)
      .select('id,displayName,givenName,surname,emailAddresses,userPrincipalName,department')
      .top(5)
      .get((err, res) => {
        if (err) {
          this._handleError(err);
        }
        callback(err, (res) ? res.value : []);
      }).catch(reason => console.log(reason));
  }
  // GET user/id/photo/$value for each person 
  getProfilePics(personas, callback) {

    const photosPromises = personas.map((persona) => {

      const personaPromise = (persona) => new Promise(
        (resolve, reject) => {

          if (persona.id) {
            this.client
              .api(`/users/${persona.id}/photo/$value`)
              .header('Cache-Control', 'no-cache')
              .responseType('blob')
              .get((err, res, rawResponse) => {

                if (rawResponse) {

                  getBlobUrl(rawResponse)
                    .then(url => resolve({ ...persona, photo: url, imageUrl: "blob:" + url, initialsColor: null }))
                    .catch(reason => {
                      console.log("No fue posible la url de la foto", reason);
                      reject({ ...persona, photo: "", imageUrl: "" });
                    });
                }

              }).catch(reason => {
                console.log("Fallo get user photo ", reason);
                reject({ ...persona, photo: "", imageUrl: "" })
              });
          } else {
            reject(persona);
          }
        });
      return personaPromise(persona);
    });

    Promise.all([...photosPromises]).then((photos) => {
      callback(photos);
    }).catch((reason) => {
      console.log("promise error", reason);
      callback(personas);
    });
  }

  // GET users?$filter=displayName startswith('{searchText}')
  searchForPeople(searchText, callback) {
    this.client
      .api('/users')      
      .filter(`startswith(displayName,'${searchText}') or startswith(givenName,'${searchText}') or startswith(surname,'${searchText}') or startswith(mail,'${searchText}') or startswith(userPrincipalName,'${searchText}')`)
      .select('displayName,givenName,surname,mail,userPrincipalName,id')
      .top(5)
      .get((err, res) => {
        if (err) {
          this._handleError(err);
        }
        callback(err, (res) ? res.value : []);
      });
  }

  // POST me/sendMail
  sendMail(recipients, subject, mail, callback) {
    //`<p></p>`
    const email = {
      Subject: subject,
      Body: {
        ContentType: 'HTML',
        Content: mail
      },
      ToRecipients: recipients
    };
    this.client
      .api('/me/sendMail')
      .post({ 'message': email, 'saveToSentItems': true }, (err, res, rawResponse) => {
        if (err) {
          this._handleError(err);
        }
        //callback(err, rawResponse.req._data.message.ToRecipients);
        callback(err);
      });
  }

  // GET drive/root/children
  getFiles(nextLink, callback) {
    let request;
    if (nextLink) {
      request = this.client
        .api(nextLink)
    }
    else {
      request = this.client
        .api('/me/drive/root/children')
        .select('name,createdBy,createdDateTime,lastModifiedBy,lastModifiedDateTime,webUrl,file')
        .top(100) // default result set is 200
    }
    request.get((err, res) => {
      if (err) {
        this._handleError(err);
      }
      callback(err, res);
    });
  }

  _handleError(err) {
    console.log(err.code + ' - ' + err.message);

    // This sample just redirects to the login function when the token is expired.
    // Production apps should implement more robust token management.
    if (err.statusCode === 401 && err.message === 'Access token has expired.') {
      history.push("/");
    }
  }
}