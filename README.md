# Astral [WIP]

A Course Mangement System inspired by Harvard Extensions and MIT Stellar.

# Installation

### Database Setup

All you need to do is run the *create_dbs.mysql* script.
This script creates a Database called **Astral** which contains all the required
tables required to run this application.

You can then login with the ``` administrator``` account which has the default 
password ```administrator```. You can obviously change this later.

```
 mysql> source ./create_dbs.mysql;
 mysql> quit
```

### Application Setup

Just execute the following commands.

```
 $ git clone https://github.com/antony-jr/Astral
 $ cd Astral
 $ yarn 
 $ yarn next # Run the app, now go to http://localhost:3000/
```

# License

The MIT License.

Antony Jr.
 
