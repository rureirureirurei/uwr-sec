### Cyber Security class at UWR 2024
Denys Zinoviev

Legend:
- ✅ - Tested, refactored, everything is alright
- ❌ - Something important is not implemented yet
- ❓ - Core functionality implemented, but may be improved 



### LISTA P1 : 45 / 45 points
- Zadanie 1
  - ~~ssh~~
  - ~~2FA~~
  - ~~GPG~~ 
- Zadanie 2
  - ~~transfer page~~
  - ~~extension~~
- Zadanie 3
  - ~~self signed local CA~~
  - real DNS and letsencrypt ❓


### LISTA P2 : 30 / 30 points
- Zadanie 1
  - ~~login~~
    - ~~validate~~ 
  - ~~sign up~~
      - ~~validate~~
  - reset password
    - ~~core functionality~~ 
    - ~~expires after 5 min~~
    - remove after use❓
  - ~~password hashing `ARGON2I + SALT + PEPPER`~~
  - ~~persistence service~~

- ~~Zadanie 2~~
    - ~~session handling with jwt~~
    - ~~persistence for transfer transactions~~
    - ~~page that displays transactions~~
    - ~~verify token in the api endpoint~~
    - ~~finally replace login with email or at least rename it idk~~

### LISTA P3 : 0 / 20 points
- oauth ❌

### LISTA P4: 0 / 40 points
- totp (Didn't add it to the login page, but it's a cybersec class, not the web app development one 🤷)
  - ~~totp gen~~
  - ~~totp verify~~
  - ~~totp sql add to table~~
  - totp add to login page
-sqlmap
  - test sqlmap
  - make code vulnerable

### LISTA P5: 0 / 40 points
- basic rsa timing
- blind sign 
- blind decrypt

### LISTA P6: 10 / 100 points
- 20 ZAP
-  ~~10 jwt~~
- 10 session storage
- 10 sec config
- cctv backdoor
- cctv invinsible

