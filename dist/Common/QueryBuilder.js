"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildBlogUpdateQuery(blog) {
    //get the blog object's properties and property values -- each entry is: ['property', 'property value']
    var blogEntries = Object.entries(blog);
    //prepare query
    var query = "";
    var queryPredicate = "UPDATE BLOG SET";
    var querySuffix = "WHERE blogID = ?";
    var queryBuilder = [];
    //push query predicate into the queryBuilder
    queryBuilder.push(queryPredicate);
    //traverse the blog's entries
    for (var entry in blogEntries) {
        //determine which blog properties need to be updated
        if (blogEntries[entry][1] !== undefined && blogEntries[entry][1] !== null && blogEntries[entry][0] !== 'blogID' && blogEntries[entry][1] !== "") { //empty string not acceptable update value
            //push the blog property into the queryBuilder
            queryBuilder.push(blogEntries[entry][0] + ' = ?');
            //push the comma separator into the queryBuilder
            queryBuilder.push(',');
        }
    }
    //remove final comma
    queryBuilder.pop();
    //push the query suffix into the queryBuilder
    queryBuilder.push(querySuffix);
    //join the query elements into a string
    query = queryBuilder.join(' ');
    console.log(query);
    //return the built query
    return query;
}
exports.buildBlogUpdateQuery = buildBlogUpdateQuery;
