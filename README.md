# Airbean by Ruby Rollers

## Instruktioner

I detta grupparbete ska vi skapa ett API för en webbapp där det går att beställa kaffe och få den levererad via drönare (drönare ingår ej i uppgiften).

## Arbetsgång

1. Läs igenom alla user stories och försök bestämma vad för api endpoints vi behöver.
2. Diskutera hur vår datamodell ska se ut och vad för data ska vi skicka tillbaka. 
3. Dela upp arbetet.

### Kriterier

* Uppfyller alla krav av funktionalitet.
* Använder sig av Express och NeDB som databas (en annan databas exempelvis MongoDB är okej ifall alla i gruppen är överens om detta).
* All input som skickas i url eller i body ska valideras i en middleware och ifall det är fel data ska ett felmeddelande skickas tillbaka.
* Det ska enbart gå att lägga till produkter som finns i menyn, ifall någon annan produkt skickas med så ska ett felmeddelande skickas tillbaka. Även pris ska kontrolleras, allt detta ska göras i en middleware.
* När ett konto skapas ska detta kopplas till ett slumpat användarid (här används fördelaktigt ett bibliotek) där användarid:et sedan kan användas för att hämta orderhistorik, användarnamn ska alltså ej skickas med i url för att hämta orderhistorik.
* Kunna se pågående beställningar och tidigare beställningar (man kollar när beställningen lades (klockslag) gentemot vad klockan är nu. Här är det godkänt att använda något bibliotek för datum och tidshantering (ex. `moment.js` eller `date-fns`).


## Contributors
- cecilialjungquist
- samCcode
- Lodenius
- LisaRydCarlsson

# Methods

### Hämta menyn
` GET /api/beans `

### Lägg order
` POST /api/beans/order `

Exempel på request body:
`{
	"userID": "34T10vzNa9SYOFW9",
	"order": [
		{
			"id": "coffee-m2h37k2mnh"
		},
		{
			"id": "coffee-220dodpzmg"
		}
	]
}`

### Skapa konto
` POST /api/user/signup `

Exempel på request body:
`{
	"username": "username",
	"password": "password1234"
}`

### Logga in
` GET /api/user/login `

Exempel på request body:
`{
	"username": "username",
	"password": "password1234"
}`

### Hämta orderhistorik
` GET /api/user/history `

Exempel på request body:
`{
	"userID": "11223344"
}`

### Hämta orderstatus
` GET /api/beans/order/status `

Exempel på request body:
`{
	"userID": "11223344",
	"orderNumber": "55667788"
}`

