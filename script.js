Rewrite using async/await
Rewrite this example code from the chapter 
Promises chaining using async/await instead of .then/catch:

function loadJson(url) {
  return fetch(url)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    });
}

loadJson('no-such-user.json')
  .catch(alert); // Error: 404

## attempt at solution

async function loadJson(url) {
	let response = await fetch(url);

	if (response.status == 200) {
		return response.json();
	}

	throw new Error(response.status);
}

loadJson('no-such-user.json')
	.catch(alert);

// 1. the function loadJson becomes async
// 2. all .then inside are replaced with await
// 3. We can return response.json() istead of awaitng for it
// 4. The error thrown from loadJson is handled by .catch. we can't use 
// await loadJson(...) there, because we're not in an async function.

#####################################################################

Rewrite "rethrow" with async/await
Below you can find the “rethrow” example.
 Rewrite it using async/await instead of .then/catch.

And get rid of the recursion in favour of a loop in 
demoGithubUser: with async/await that becomes easy to do.

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

function loadJson(url) {
  return fetch(url)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new HttpError(response);
      }
    });
}

// Ask for a user name until github returns a valid user
function demoGithubUser() {
  let name = prompt("Enter a name?", "iliakan");

  return loadJson(`https://api.github.com/users/${name}`)
    .then(user => {
      alert(`Full name: ${user.name}.`);
      return user;
    })
    .catch(err => {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("No such user, please reenter.");
        return demoGithubUser();
      } else {
        throw err;
      }
    });
}

demoGithubUser();

## Attempt at solution

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJson(url) {
	let response = await fetch(url);

	if (response.status == 200) {
		return response.json();
	} else {
		throw new Error(response.status);
	}
}

// Ask for a user name until github returns a valid user
async function demoGithubUser() {
	let user;
	while(true) {
		let name = prompt("Enter a name?", "iliakan");

		try {
			user = await loadJson(url${name});
			break; // no error, exit loop
		} catch(err) {
			if (err instanceof HttpError && err.response.status == 404) {
				//loop continues after the alert
				alert("No such user, please reenter.");
			} else {
				// unknown error, rethrow;
				throw err;
			}
		}
	}

	alert(`Full name: &{user.name}.`);
	return user;
}

demoGithubUser();

#####################################################################

Call async from non-async
We have a “regular” function called f. How can you call the 
async function wait() and use its result inside of f?

async function wait() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return 10;
}

function f() {
  // ...what should you write here?
  // we need to call async wait() and wait to get 10
  // remember, we can't use "await"
}

// that's the case when knowing how it works inside is helpful.
// just treat async call as promise and attach.then to it:

async function wait() {
	await new Promise(resolve => setTimeout(resolve, 1000));

	return 10;
}

function f() {
	// shows 10 after 1 second
	wait().then(result => alert(result));
}

f();

// in this case just consider the result of the wait() function as
// a thenable and you just attach .then to it.

