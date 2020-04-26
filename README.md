# Shamir's Secret Implementation for Data Storage and Recovery 

<span style="color:red"> [EXPERIMENTAL ONLY - DO NOT THINK ABOUT USING IN PRODUCTION] </span>

## Run the program

1. Clone the repo & enter directory

```
$ https://github.com/yakkomajuri/shamir-auth/
$ cd shamir-auth

```

2. Install dependencies

`npm install`

3. Set environment variables

```
export SHAMIR_USERNAME=[USERNAME]
export SHAMIR_PASSWORD=[PASSWORD]
```

4. Run the program and type "encrypt":

```
$ node app
What would you like to do? (encrypt/decrypt): encrypt
```

5. After successful encryption, run with "decrypt":

```
$ node app
What would you like to do? (encrypt/decrypt): decrypt
```

You should see the secret you set! It was recovered with 6/11 parts only! If you want to see it fail, 
export a new environment variable with a wrong username or password.
