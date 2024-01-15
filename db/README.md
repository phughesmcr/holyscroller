# Data Sources and Acknowledgements

## bible.db (also book_info.json & book_titles.json)

The SQLite3 database file `bible.db` is a Deno.Kv (a key-value pair database from Deno) version of the
[Scrollmapper "Bible Versions and Cross-Reference Databases"](https://github.com/scrollmapper/bible_databases) which is
shared under the terms of the [GNU General Public License v3.0](http://www.gnu.org/licenses/). That database includes
the [OpenBible.info Cross-References database](http://www.openbible.info/labs/cross-references/), itself shared under
the [CC BY 4.0 DEED](https://creativecommons.org/licenses/by/4.0/) license. This `bible.db` database is shared under the
same terms as the original database. The `book_info.json` and `book_titles.json` files are JSON versions of the
corresponding tables the `bible.db` database.

It contains the following tables, where [id] is an integer in the format BBCCCVVV (see Scrollmapper):

- translations
  - asv (American Standard Version)
      - id: `string`
  - cut (Chinese Union Version - Traditional)
      - id: `string`
  - bbe (Bible in Basic English)
      - id: `string`
  - kjv (King James Version)
      - id: `string`
  - web (World English Bible)
      - id: `string`
- books
  - number (1-66): `BookInfo`
- crossrefs
  - id: `number[]` array of verse ids
- pericopes
  - id: `Pericope[]`

## pericopes.json

The `pericopes.json` file is a JSON version of the file `2450.Pericopes.xls` from
[the OP on this forum thread](https://community.logos.com/forums/t/70978.aspx) created by user "Robert M. Warren"
Posted: Sun, Jun 2 2013 8:04 AM. No license is specified.

## catechism.json

The 1662 Book of Common Prayer's "A Catechism". Extracts from The Book of Common Prayer, the rights in which are vested in the Crown, are reproduced by permission of the Crown's patentee, Cambridge University Press.
