import requests
from bs4 import BeautifulSoup
import mysql.connector

# get the max page of the website
def maxPage():
    url = 'https://offcampus.osu.edu/search-housing.aspx'
    r = requests.get(url)
    s = BeautifulSoup(r.content, 'html.parser')
    pages = s.find(class_="c-paging")
    page = pages.find_all('li')
    max_page = page[len(page) - 2].get_text()
    print(max_page)
    return(int(max_page))

# get the housing information and upload it to database
def getInfo(cursor, db_connection):
    for i in range(maxPage()):
        url = "https://offcampus.osu.edu/search-housing.aspx?page=" + str(
                i) + "&pricefrom=0&sort=1&alllandlords=0"
        r = requests.get(url)
        s = BeautifulSoup(r.content, 'html.parser')
        result = s.find(class_="o-row o-row--flex o-row--gutter u-margin-top-sm")
        houses = result.find_all(class_="o-row__col o-row__col--6of12@md o-row__col--4of12@xl")
        # scraping each house
        for i in range(len(houses)):
            house = houses[i].find(class_="c-propertycard__info")
            address = house.find('h2').get_text().strip()
            # get the existing address
            cursor.execute("Select address from houses")
            if address not in ([row[0] for row in cursor.fetchall()]):
                content = house.find_all('dd')

                rent = content[0].get_text().strip()
                index = rent.find(' - ')
                if(index==-1):
                    lowerRent=rent[1:len(rent)-3]
                    upperRent=lowerRent
                else:
                    lowerRent = rent[1:index].replace(',', '')
                    lowerRent= lowerRent[0: len(lowerRent)-3]
                    upperRent = rent[index+4: len(rent)].replace(',','')
                    upperRent= upperRent[0: len(upperRent)-3]

                bedroom = content[1].get_text().strip()
                bedroom = bedroom[0: len(bedroom)-5]

                bathroom = content[2].get_text().strip()
                bathroom = ' '.join(filter(str.isdigit, bathroom))
                bathArray = bathroom.split(' ')
                full_bath = bathArray[0]
                half_bath = bathArray[1]

                amenities = content[3].get_text().strip()
                a_tags = house.find_all('a')
                detail = a_tags[1]['href']
                url = "https://offcampus.osu.edu" + detail

                #inset each house info to the database 
                insert_data(cursor, db_connection, address, lowerRent, upperRent, full_bath, half_bath, bedroom, amenities, url)

# connect to the database
def connect_db():
    connection = mysql.connector.connect(
        host='localhost',
        user='root',       # Replace with your MySQL username
        password='',   # Replace with your MySQL password
        database=''
    )
    return connection
