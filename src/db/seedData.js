
import { db } from "./dexieDB";

// Realistic first names and last names
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Laura',
  'Jeffrey', 'Helen', 'Ryan', 'Sharon', 'Jacob', 'Cynthia', 'Gary', 'Kathleen',
  'Nicholas', 'Amy', 'Eric', 'Shirley', 'Jonathan', 'Angela', 'Stephen', 'Anna',
  'Larry', 'Ruth', 'Justin', 'Brenda', 'Scott', 'Pamela', 'Brandon', 'Nicole',
  'Benjamin', 'Katherine', 'Samuel', 'Samantha', 'Gregory', 'Christine', 'Frank', 'Emma',
  'Alexander', 'Catherine', 'Raymond', 'Debra', 'Patrick', 'Virginia', 'Jack', 'Rachel',
  'Dennis', 'Carolyn', 'Jerry', 'Janet', 'Tyler', 'Maria', 'Aaron', 'Heather',
  'Jose', 'Diane', 'Adam', 'Julie', 'Henry', 'Joyce', 'Nathan', 'Victoria',
  'Douglas', 'Kelly', 'Zachary', 'Christina', 'Peter', 'Lauren', 'Carl', 'Madison',
  'Arthur', 'Megan', 'Gerald', 'Cheryl', 'Roger', 'Olivia', 'Keith', 'Hannah',
  'Jeremy', 'Sophia', 'Terry', 'Grace', 'Sean', 'Isabella', 'Christian', 'Ava',
  'Albert', 'Chloe', 'Joe', 'Ella', 'Ethan', 'Natalie', 'Austin', 'Sofia',
  'Jesse', 'Avery', 'Billy', 'Addison', 'Bruce', 'Lily', 'Bryan', 'Zoe',
  'Jordan', 'Lillian', 'Ralph', 'Aubrey', 'Roy', 'Scarlett', 'Noah', 'Eleanor'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
  'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans',
  'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart',
  'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan',
  'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim',
  'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James',
  'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo',
  'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Powell',
  'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson',
  'Barnes', 'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson',
  'Alexander', 'Hamilton', 'Graham', 'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West',
  'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson', 'Ellis', 'Tran', 'Medina',
  'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens', 'Harrison',
  'Fernandez', 'Mcdonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Vargas', 'Henry',
  'Chen', 'Freeman', 'Webb', 'Tucker', 'Guzman', 'Burns', 'Crawford', 'Olson',
  'Simpson', 'Porter', 'Hunter', 'Gordon', 'Mendez', 'Silva', 'Shaw', 'Snyder',
  'Mason', 'Dixon', 'Munoz', 'Hunt', 'Hicks', 'Holmes', 'Palmer', 'Wagner',
  'Black', 'Robertson', 'Boyd', 'Rose', 'Stone', 'Salazar', 'Fox', 'Warren',
  'Mills', 'Meyer', 'Rice', 'Schmidt', 'Garza', 'Daniels', 'Ferguson', 'Nichols',
  'Stephens', 'Soto', 'Weaver', 'Ryan', 'Gardner', 'Payne', 'Grant', 'Dunn',
  'Kelley', 'Spencer', 'Hawkins', 'Arnold', 'Pierce', 'Vazquez', 'Hansen', 'Peters',
  'Santos', 'Hart', 'Bradley', 'Knight', 'Elliott', 'Cunningham', 'Duncan', 'Armstrong',
  'Hudson', 'Carroll', 'Lane', 'Riley', 'Andrews', 'Alvarado', 'Ray', 'Delgado',
  'Berry', 'Perkins', 'Hoffman', 'Johnston', 'Matthews', 'Pena', 'Richards', 'Contreras',
  'Willis', 'Carpenter', 'Lawrence', 'Sandoval', 'Guerrero', 'George', 'Chapman', 'Rios',
  'Estrada', 'Ortega', 'Watkins', 'Greene', 'Nunez', 'Wheeler', 'Valdez', 'Harper',
  'Lynch', 'Marsh', 'Mack', 'Brock', 'Mann', 'Zimmerman', 'French', 'Kramer',
  'Mccormick', 'Parsons', 'Thornton', 'Mcdaniel', 'Jefferson', 'Reeves', 'Hines', 'Ball',
  'Santiago', 'Joseph', 'Norman', 'Bishop', 'Phelps', 'Baldwin', 'Briggs', 'Cummings',
  'Moran', 'Webster', 'Goodman', 'Hodges', 'Bowen', 'Daniel', 'Barber', 'Caldwell',
  'Fowler', 'Powers', 'Love', 'Schultz', 'Larson', 'Robles', 'Luna', 'Walters',
  'Neal', 'Carson', 'Mullen', 'Wolf', 'Dennis', 'Park', 'Bush', 'Moss',
  'Quinn', 'Swanson', 'Barker', 'Maxwell', 'Lawson', 'Hampton', 'Jacobs', 'Franklin',
  'Roy', 'Bishop', 'Lowe', 'Leonard', 'Rhodes', 'Byrd', 'Gregory', 'Shelton',
  'Frazier', 'Beck', 'Newman', 'Haynes', 'Mcdowell', 'Lindsay', 'Klein', 'Brock',
  'Sparks', 'Drake', 'Wong', 'Jefferson', 'Barton', 'Underwood', 'Mccarty', 'Schneider',
  'Osborne', 'Cobb', 'Bass', 'Flowers', 'Davenport', 'Conner', 'Skinner', 'Chambers',
  'Burns', 'Holland', 'Lamb', 'Newton', 'Mcgee', 'Higgins', 'Curtis', 'Reid',
  'Singleton', 'Wilkins', 'Eaton', 'Clayton', 'Poole', 'Sherman', 'Tillman', 'Dean',
  'Buchanan', 'Potter', 'Norris', 'Bates', 'Lyons', 'Carson', 'Manning', 'Cain',
  'Dudley', 'Gill', 'Page', 'Ballard', 'Bond', 'Wilkerson', 'Barton', 'Logan',
  'Huff', 'Burgess', 'Wise', 'Benson', 'Sharp', 'Bowman', 'Barton', 'Clay',
  'Monroe', 'Todd', 'Blair', 'Mullins', 'Brock', 'Ashley', 'Hubbard', 'Gross',
  'Stokes', 'Dawson', 'Santiago', 'Barrett', 'Hopkins', 'Keller', 'Thornton', 'Parks',
  'Mckenzie', 'Warner', 'Payne', 'Carroll', 'Hartman', 'Morton', 'Fletcher', 'Wade',
  'Sullivan', 'Chambers', 'Caldwell', 'Beck', 'Lambert', 'Oliver', 'Johnston', 'Gregory',
  'Murray', 'Tucker', 'Spencer', 'Dennis', 'Walton', 'Burns', 'Buchanan', 'Barker',
  'Harper', 'Mills', 'Lucas', 'Stanley', 'Bowen', 'Barber', 'Cunningham', 'Barton',
  'Moss', 'Bush', 'Sawyer', 'Higgins', 'Horton', 'Barnett', 'Ray', 'Vaughn',
  'Mack', 'Riley', 'Holland', 'Newton', 'Todd', 'Blair', 'Bridges', 'Bryan',
  'Haynes', 'Miles', 'Lyons', 'Rhodes', 'Park', 'Warner', 'Padilla', 'Bush',
  'Mckenzie', 'Carr', 'Owens', 'Pittman', 'Brock', 'Barton', 'Bauer', 'Rivers',
  'Cobb', 'Frank', 'Owen', 'French', 'Logan', 'Norris', 'Barker', 'Buchanan',
  'Carson', 'Morrow', 'Combs', 'Floyd', 'Osborne', 'Mcguire', 'Chandler', 'Blair',
  'Malone', 'Wolf', 'Hodges', 'Mueller', 'Klein', 'Brock', 'Serrano', 'Pollard',
  'Hoover', 'Morse', 'Doyle', 'Dodson', 'Mccullough', 'Lam', 'Walters', 'Bauer',
  'Prince', 'Brady', 'Boyle', 'Casey', 'Roberson', 'Stevenson', 'Mccormick', 'Compton',
  'Norman', 'Moody', 'Lindsey', 'Cline', 'Oconnor', 'Knox', 'Bruce', 'Lang',
  'Sanford', 'Bond', 'Cherry', 'Finley', 'Nolan', 'Livingston', 'Little', 'Whitney',
  'Bass', 'Hester', 'Flowers', 'Coffey', 'Pitts', 'Weiss', 'Hoover', 'Nicholson',
  'Crane', 'Riddle', 'Moon', 'Baird', 'Hebert', 'Madden', 'Corona', 'Mcintosh',
  'Leach', 'Meadows', 'Marks', 'Cantrell', 'Stafford', 'Weeks', 'Corona', 'Friedman',
  'Bond', 'Duke', 'Kirkland', 'Bruce', 'Hancock', 'Finch', 'Harmon', 'Brock',
  'Skinner', 'Lindsay', 'Bennett', 'Horton', 'Boyle', 'French', 'Larson', 'Norris',
  'Owens', 'Wolfe', 'Barker', 'Barton', 'Bauer', 'Bowen', 'Boyd', 'Boyle',
  'Brock', 'Buchanan', 'Burgess', 'Burns', 'Bush', 'Butler', 'Byrd', 'Cain',
  'Calhoun', 'Camacho', 'Cameron', 'Campbell', 'Canfield', 'Cannon', 'Carey', 'Carlson',
  'Carney', 'Carpenter', 'Carr', 'Carroll', 'Carson', 'Carter', 'Carver', 'Case',
  'Casey', 'Cash', 'Castaneda', 'Castillo', 'Castro', 'Cervantes', 'Chambers', 'Chan',
  'Chandler', 'Chaney', 'Chapman', 'Charles', 'Chase', 'Chavez', 'Chen', 'Cherry',
  'Christensen', 'Christian', 'Church', 'Clark', 'Clarke', 'Clay', 'Clayton', 'Clements',
  'Clemons', 'Cleveland', 'Cline', 'Cobb', 'Cochran', 'Coffey', 'Cohen', 'Cole',
  'Coleman', 'Collier', 'Collins', 'Colon', 'Combs', 'Compton', 'Conley', 'Conner',
  'Conrad', 'Contreras', 'Conway', 'Cook', 'Cooke', 'Cooley', 'Cooper', 'Copeland',
  'Cortez', 'Cote', 'Cotton', 'Cox', 'Craft', 'Craig', 'Crane', 'Crawford',
  'Crosby', 'Cross', 'Cruz', 'Cummings', 'Cunningham', 'Curry', 'Curtis', 'Dale',
  'Dalton', 'Daniel', 'Daniels', 'Daugherty', 'Davenport', 'David', 'Davidson', 'Davis',
  'Dawson', 'Day', 'Dean', 'Decker', 'Dejesus', 'Delacruz', 'Delgado', 'Dennis',
  'Diaz', 'Dickerson', 'Dickson', 'Dillard', 'Dillon', 'Dixon', 'Dodson', 'Dominguez',
  'Donaldson', 'Donovan', 'Dorsey', 'Dotson', 'Douglas', 'Downs', 'Doyle', 'Drake',
  'Dudley', 'Duffy', 'Duke', 'Duncan', 'Dunlap', 'Dunn', 'Duran', 'Durham',
  'Dyer', 'Eaton', 'Edwards', 'Elliott', 'Ellis', 'Ellison', 'Emerson', 'England',
  'English', 'Erickson', 'Espinoza', 'Estes', 'Estrada', 'Evans', 'Everett', 'Ewing',
  'Farley', 'Farmer', 'Farrell', 'Faulkner', 'Ferguson', 'Fernandez', 'Ferrell', 'Fields',
  'Figueroa', 'Finch', 'Finley', 'Fischer', 'Fisher', 'Fitzgerald', 'Fitzpatrick', 'Fleming',
  'Fletcher', 'Flores', 'Flowers', 'Floyd', 'Flynn', 'Foley', 'Forbes', 'Ford',
  'Foreman', 'Foster', 'Fowler', 'Fox', 'Francis', 'Franco', 'Frank', 'Franklin',
  'Franks', 'Frazier', 'Frederick', 'Freeman', 'French', 'Frost', 'Fry', 'Frye',
  'Fuentes', 'Fuller', 'Fulton', 'Gaines', 'Gallagher', 'Gallegos', 'Galloway', 'Gamble',
  'Garcia', 'Gardner', 'Garner', 'Garrett', 'Garrison', 'Garza', 'Gates', 'Gay',
  'Gentry', 'George', 'Gibbs', 'Gibson', 'Gilbert', 'Giles', 'Gill', 'Gillespie',
  'Gilliam', 'Gilmore', 'Glass', 'Glenn', 'Glover', 'Goff', 'Golden', 'Gomez',
  'Gonzales', 'Gonzalez', 'Good', 'Goodman', 'Goodwin', 'Gordon', 'Gould', 'Graham',
  'Grant', 'Graves', 'Gray', 'Green', 'Greene', 'Greer', 'Gregory', 'Griffin',
  'Griffith', 'Grimes', 'Gross', 'Guerra', 'Guerrero', 'Guthrie', 'Gutierrez', 'Guy',
  'Guzman', 'Hahn', 'Hale', 'Haley', 'Hall', 'Hamilton', 'Hammond', 'Hampton',
  'Hancock', 'Haney', 'Hansen', 'Hanson', 'Hardin', 'Harding', 'Hardy', 'Harmon',
  'Harper', 'Harrell', 'Harrington', 'Harris', 'Harrison', 'Hart', 'Hartman', 'Harvey',
  'Hatfield', 'Hawkins', 'Hayden', 'Hayes', 'Haynes', 'Hays', 'Head', 'Heath',
  'Hebert', 'Henderson', 'Hendricks', 'Hendrix', 'Henry', 'Hensley', 'Henson', 'Herman',
  'Hernandez', 'Herrera', 'Herring', 'Hess', 'Hester', 'Hewitt', 'Hickman', 'Hicks',
  'Higgins', 'Hill', 'Hines', 'Hinton', 'Hobbs', 'Hodge', 'Hodges', 'Hoffman',
  'Hogan', 'Holcomb', 'Holden', 'Holder', 'Holland', 'Holloway', 'Holman', 'Holmes',
  'Holt', 'Hood', 'Hooper', 'Hoover', 'Hopkins', 'Hopper', 'Horn', 'Horne',
  'Horton', 'House', 'Houston', 'Howard', 'Howe', 'Howell', 'Hubbard', 'Huber',
  'Hudson', 'Huff', 'Huffman', 'Hughes', 'Hull', 'Humphrey', 'Hunt', 'Hunter',
  'Hurley', 'Hurst', 'Hutchinson', 'Hyde', 'Ingram', 'Irwin', 'Jackson', 'Jacobs',
  'Jacobson', 'James', 'Jarvis', 'Jefferson', 'Jenkins', 'Jennings', 'Jensen', 'Jimenez',
  'Johns', 'Johnson', 'Johnston', 'Jones', 'Jordan', 'Joseph', 'Joyce', 'Joyner',
  'Juarez', 'Justice', 'Kane', 'Kaufman', 'Keith', 'Keller', 'Kelley', 'Kelly',
  'Kemp', 'Kennedy', 'Kent', 'Kerr', 'Key', 'Kidd', 'Kim', 'King',
  'Kinney', 'Kirby', 'Kirk', 'Kirkland', 'Klein', 'Kline', 'Knapp', 'Knight',
  'Knowles', 'Knox', 'Koch', 'Kramer', 'Lamb', 'Lambert', 'Lancaster', 'Landry',
  'Lane', 'Lang', 'Langley', 'Lara', 'Larsen', 'Larson', 'Lawrence', 'Lawson',
  'Le', 'Leach', 'Leblanc', 'Lee', 'Leon', 'Leonard', 'Lester', 'Levine',
  'Levy', 'Lewis', 'Lindsay', 'Lindsey', 'Little', 'Livingston', 'Lloyd', 'Logan',
  'Long', 'Lopez', 'Lott', 'Love', 'Lowe', 'Lowery', 'Lucas', 'Luna',
  'Lynch', 'Lynn', 'Lyons', 'Macdonald', 'Macias', 'Mack', 'Madden', 'Maddox',
  'Maldonado', 'Malone', 'Mann', 'Manning', 'Marks', 'Marquez', 'Marsh', 'Marshall',
  'Martin', 'Martinez', 'Mason', 'Massey', 'Mathews', 'Mathis', 'Matthews', 'Maxwell',
  'May', 'Mayer', 'Maynard', 'Mayo', 'Mays', 'Mcbride', 'Mccall', 'Mccarthy',
  'Mccarty', 'Mcclain', 'Mcclure', 'Mcconnell', 'Mccormick', 'Mccoy', 'Mccray', 'Mccullough',
  'Mcdaniel', 'Mcdonald', 'Mcdowell', 'Mcfadden', 'Mcfarland', 'Mcgee', 'Mcgowan', 'Mcguire',
  'Mcintosh', 'Mcintyre', 'Mckay', 'Mckee', 'Mckenzie', 'Mckinney', 'Mcknight', 'Mclaughlin',
  'Mclean', 'Mcleod', 'Mcmahon', 'Mcmillan', 'Mcneil', 'Mcpherson', 'Meadows', 'Medina',
  'Mejia', 'Melendez', 'Melton', 'Mendez', 'Mendoza', 'Mercer', 'Merrill', 'Merritt',
  'Meyer', 'Meyers', 'Michael', 'Middleton', 'Miles', 'Miller', 'Mills', 'Miranda',
  'Mitchell', 'Molina', 'Monroe', 'Montgomery', 'Montoya', 'Moody', 'Moon', 'Mooney',
  'Moore', 'Morales', 'Moran', 'Moreno', 'Morgan', 'Morin', 'Morris', 'Morrison',
  'Morrow', 'Morse', 'Morton', 'Moses', 'Mosley', 'Moss', 'Mueller', 'Mullen',
  'Mullins', 'Munoz', 'Murphy', 'Murray', 'Myers', 'Nash', 'Navarro', 'Neal',
  'Nelson', 'Newman', 'Newton', 'Nguyen', 'Nichols', 'Nicholson', 'Nielsen', 'Nieves',
  'Nixon', 'Noble', 'Noel', 'Nolan', 'Norman', 'Norris', 'Norton', 'Nunez',
  'O brien', 'O connor', 'O donnell', 'O neal', 'O neil', 'O neill', 'Ochoa', 'Odom',
  'Odonnell', 'Oliver', 'Olsen', 'Olson', 'O neal', 'O neil', 'O neill', 'Orr',
  'Ortega', 'Ortiz', 'Osborn', 'Osborne', 'Owen', 'Owens', 'Pace', 'Pacheco',
  'Padilla', 'Page', 'Palmer', 'Park', 'Parker', 'Parks', 'Parrish', 'Parsons',
  'Pate', 'Patel', 'Patrick', 'Patterson', 'Patton', 'Paul', 'Payne', 'Pearson',
  'Peck', 'Pena', 'Pennington', 'Perez', 'Perkins', 'Perry', 'Peters', 'Petersen',
  'Peterson', 'Petty', 'Phelps', 'Phillips', 'Pickett', 'Pierce', 'Pittman', 'Pitts',
  'Pollard', 'Poole', 'Pope', 'Porter', 'Potter', 'Potts', 'Powell', 'Powers',
  'Pratt', 'Preston', 'Price', 'Prince', 'Pruitt', 'Puckett', 'Pugh', 'Quinn',
  'Ramirez', 'Ramos', 'Ramsey', 'Randall', 'Randolph', 'Rasmussen', 'Ratliff', 'Ray',
  'Raymond', 'Reed', 'Reese', 'Reeves', 'Reid', 'Reilly', 'Reyes', 'Reynolds',
  'Rhodes', 'Rice', 'Rich', 'Richard', 'Richards', 'Richardson', 'Richmond', 'Riddle',
  'Riggs', 'Riley', 'Rios', 'Rivas', 'Rivera', 'Rivers', 'Roach', 'Robbins',
  'Roberson', 'Roberts', 'Robertson', 'Robinson', 'Robles', 'Rocha', 'Rodgers', 'Rodriguez',
  'Rodriquez', 'Rogers', 'Rojas', 'Rollins', 'Roman', 'Romero', 'Rosa', 'Rosales',
  'Rosario', 'Rose', 'Ross', 'Roth', 'Rowe', 'Rowland', 'Roy', 'Rubio',
  'Ruiz', 'Rush', 'Russell', 'Russo', 'Rutledge', 'Ryan', 'Salas', 'Salazar',
  'Salinas', 'Sampson', 'Sanchez', 'Sanders', 'Sandoval', 'Sanford', 'Santana', 'Santiago',
  'Santos', 'Sargent', 'Saunders', 'Savage', 'Sawyer', 'Schmidt', 'Schneider', 'Schroeder',
  'Schultz', 'Schwartz', 'Scott', 'Sears', 'Sellers', 'Serrano', 'Sexton', 'Shaffer',
  'Shannon', 'Sharp', 'Sharpe', 'Shaw', 'Shelton', 'Shepard', 'Shepherd', 'Sheppard',
  'Sherman', 'Shields', 'Short', 'Silva', 'Simmons', 'Simon', 'Simpson', 'Sims',
  'Singleton', 'Skinner', 'Slater', 'Sloan', 'Small', 'Smith', 'Snider', 'Snow',
  'Snyder', 'Solis', 'Solomon', 'Sosa', 'Soto', 'Sparks', 'Spears', 'Spence',
  'Spencer', 'Stafford', 'Stanley', 'Stanton', 'Stark', 'Steele', 'Stein', 'Stephens',
  'Stephenson', 'Stevens', 'Stevenson', 'Stewart', 'Stokes', 'Stone', 'Stout', 'Strickland',
  'Strong', 'Stuart', 'Suarez', 'Sullivan', 'Summers', 'Sutton', 'Swanson', 'Sweeney',
  'Sweet', 'Sykes', 'Talley', 'Tanner', 'Tate', 'Taylor', 'Terrell', 'Terry',
  'Thomas', 'Thompson', 'Thornton', 'Todd', 'Torres', 'Townsend', 'Tran', 'Travis',
  'Trevino', 'Trujillo', 'Tucker', 'Turner', 'Tyler', 'Tyson', 'Underwood', 'Valdez',
  'Valencia', 'Valentine', 'Valenzuela', 'Vance', 'Vang', 'Vargas', 'Vasquez', 'Vaughan',
  'Vaughn', 'Vazquez', 'Vega', 'Velasquez', 'Velazquez', 'Velez', 'Villarreal', 'Vincent',
  'Vinson', 'Wade', 'Wagner', 'Walker', 'Wall', 'Wallace', 'Waller', 'Walls',
  'Walsh', 'Walter', 'Walters', 'Walton', 'Ward', 'Ware', 'Warner', 'Warren',
  'Washington', 'Waters', 'Watkins', 'Watson', 'Watts', 'Weaver', 'Webb', 'Weber',
  'Webster', 'Weeks', 'Weiss', 'Welch', 'Wells', 'West', 'Wheeler', 'Whitaker',
  'White', 'Whitehead', 'Whitfield', 'Whitley', 'Whitney', 'Wiggins', 'Wilcox', 'Wiley',
  'Wilkerson', 'Wilkins', 'Wilkinson', 'William', 'Williams', 'Williamson', 'Willis', 'Wilson',
  'Winters', 'Wise', 'Witt', 'Wolf', 'Wolfe', 'Wong', 'Wood', 'Woodard',
  'Woods', 'Woodward', 'Wooten', 'Workman', 'Wright', 'Wyatt', 'Wynn', 'Xiong',
  'Yates', 'York', 'Young', 'Zamora', 'Zimmerman', 'Zuniga'
];

const jobTitles = [
  "Frontend Developer", "Backend Engineer", "UI/UX Designer", "QA Tester",
  "Project Manager", "Data Analyst", "DevOps Engineer", "Mobile App Developer",
  "Product Designer", "System Architect", "Support Engineer", "Content Strategist",
  "Security Specialist", "Machine Learning Engineer", "Cloud Architect",
  "Technical Writer", "HR Coordinator", "Marketing Analyst", "Sales Manager",
  "Recruitment Lead", "Graphic Designer", "Network Administrator", "Scrum Master",
  "Business Analyst", "Product Owner"
];

const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const slugify = (title) =>
  title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const randomDate = (daysBack = 60) => {
  const now = new Date();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset).toISOString();
};

// Generate realistic email from name
const generateEmail = (firstName, lastName) => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
  const variations = [
    `${firstName}.${lastName}`,
    `${firstName}${lastName}`,
    `${firstName.charAt(0)}.${lastName}`,
    `${firstName}${lastName.charAt(0)}`,
    `${firstName}_${lastName}`
  ];

  const username = randomItem(variations).toLowerCase();
  const domain = randomItem(domains);
  return `${username}@${domain}`;
};

export async function seedDatabase() {
  try {
    const jobCount = await db.jobs.count();
    const candidateCount = await db.candidates.count();

    if (jobCount > 0 && candidateCount > 0) {
      console.log("✅ Database already seeded");
      return;
    }

    console.log("🌱 Seeding TalentFlow database with realistic data...");

    // Clear existing data
    await db.jobs.clear();
    await db.candidates.clear();
    await db.timelines.clear();

    // Create jobs
    const jobs = jobTitles.map((title, i) => ({
      title,
      slug: slugify(title),
      status: i % 5 === 0 ? "archived" : "active",
      tags: ["tech", "remote"],
      order: i + 1,
      createdAt: randomDate(90),
      updatedAt: randomDate(30),
    }));

    const jobIds = await db.jobs.bulkAdd(jobs);

    // Create 1000 realistic candidates
    const candidates = [];
    const timelines = [];

    for (let i = 0; i < 1000; i++) {
      const firstName = randomItem(firstNames);
      const lastName = randomItem(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const email = generateEmail(firstName, lastName);
      const stage = randomItem(stages);
      const jobId = randomItem(jobIds);
      const candidateId = i + 1;

      candidates.push({
        id: candidateId,
        name: fullName,
        email: email,
        stage: stage,
        jobId: jobId,
        createdAt: randomDate(90),
        updatedAt: randomDate(30),
        history: []
      });

      // Create realistic timeline entries
      const timelineLength = Math.floor(Math.random() * 4) + 1; // 1-4 entries
      let currentStage = "applied";
      let currentTime = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Start 90 days ago

      for (let t = 0; t < timelineLength; t++) {
        const nextStage = t === timelineLength - 1 ? stage : randomItem(stages.filter(s => s !== currentStage));
        const timeIncrement = Math.floor(Math.random() * 20 + 5) * 24 * 60 * 60 * 1000; // 5-25 days
        currentTime = new Date(currentTime.getTime() + timeIncrement);

        const note = getStageTransitionNote(currentStage, nextStage);

        timelines.push({
          candidateId: candidateId,
          timestamp: currentTime.toISOString(),
          note: note,
          from: currentStage,
          to: nextStage,
        });

        currentStage = nextStage;
      }
    }

    await db.candidates.bulkAdd(candidates);
    await db.timelines.bulkAdd(timelines);

    console.log(`✅ Seeded ${jobs.length} jobs, ${candidates.length} candidates, ${timelines.length} timeline entries`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Helper function for realistic stage transition notes
function getStageTransitionNote(fromStage, toStage) {
  const notes = {
    "applied-screen": [
      "Application reviewed and moved to screening",
      "Initial qualification check passed",
      "Moved to screening phase"
    ],
    "screen-tech": [
      "Screening interview completed successfully",
      "Technical assessment scheduled",
      "Advanced to technical round"
    ],
    "tech-offer": [
      "Technical interview passed",
      "All interview rounds completed successfully",
      "Selected for offer stage"
    ],
    "offer-hired": [
      "Offer accepted by candidate",
      "Onboarding process initiated",
      "Successfully hired"
    ],
    "applied-rejected": [
      "Does not meet minimum qualifications",
      "Position filled by another candidate",
      "Withdrawn from consideration"
    ],
    "screen-rejected": [
      "Screening interview did not meet expectations",
      "Candidate withdrew from process",
      "Not selected for technical round"
    ],
    "tech-rejected": [
      "Technical skills did not meet requirements",
      "Failed technical assessment",
      "Not selected for offer stage"
    ]
  };

  const key = `${fromStage}-${toStage}`;
  const availableNotes = notes[key] || [`Moved from ${fromStage} to ${toStage}`];
  return randomItem(availableNotes);
}