/*
* Copyright 2012 Research In Motion Limited.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

#include <gtest/gtest.h>
#include <json/value.h>
#include "../pim_contacts_qt.hpp"

int contactId;

TEST(PimContacts, CanCreateContact)
{
    webworks::PimContactsQt pimContacts;
    Json::Value args;

    args["name"] = Json::Value();
    args["name"]["givenName"] = Json::Value("Alexander");
    args["name"]["familyName"] = Json::Value("Smitherman");
    args["emails"] = Json::Value();

    Json::Value workEmail = Json::Value();
    workEmail["type"] = Json::Value("work");
    workEmail["value"] = Json::Value("alex.smitherman@rim.com");

    Json::Value workPhone = Json::Value();
    workPhone["type"] = Json::Value("work");
    workPhone["value"] = Json::Value("5191234567");

    args["emails"].append(workEmail);
    args["phoneNumbers"].append(workPhone);

    Json::Value result = pimContacts.Save(args);

    EXPECT_EQ(true, result["_success"].asBool());

    contactId = result["id"].asInt();
}

TEST(PimContacts, CanFindContacts)
{
    webworks::PimContactsQt pimContacts;
    Json::Value args;

    args["fields"] = Json::Value();
    args["fields"].append(Json::Value("name"));
    args["fields"].append(Json::Value("emails"));
    args["fields"].append(Json::Value("phoneNumbers"));

    args["options"] = Json::Value();
    args["options"]["favorite"] = Json::Value(false);
    args["options"]["limit"] = Json::Value(5);
    args["options"]["filter"] = Json::Value();

    Json::Value filter;
    filter["fieldName"] = Json::Value(0);
    filter["fieldValue"] = Json::Value("Alexander");

    args["options"]["filter"].append(filter);
    args["options"]["sort"].append(Json::Value());

    Json::Value result = pimContacts.Find(args);

    Json::Value expected;
    expected["_success"] = Json::Value(true);
    expected["contacts"] = Json::Value();

    EXPECT_EQ(true, result["_success"].asBool());

    if (result["contacts"].isArray()) {
        Json::Value contacts = result["contacts"];
        int i = 0;
        int size = contacts.size();

        EXPECT_EQ(1, size);
        EXPECT_EQ("Alexander", contacts[i]["name"]["givenName"].asString());
        EXPECT_EQ("Smitherman", contacts[i]["name"]["familyName"].asString());
        EXPECT_EQ("work", contacts[i]["emails"][i]["type"].asString());
        EXPECT_EQ("alex.smitherman@rim.com", contacts[i]["emails"][i]["value"].asString());
        EXPECT_EQ("work", contacts[i]["phoneNumbers"][i]["type"].asString());
        EXPECT_EQ("5191234567", contacts[i]["phoneNumbers"][i]["value"].asString());
    }
}

TEST(PimContacts, CanFilterNonFavorite)
{
    webworks::PimContactsQt pimContacts;
    Json::Value args;
    int size = 0;

    args["fields"] = Json::Value();
    args["fields"].append(Json::Value("name"));

    args["options"] = Json::Value();
    args["options"]["favorite"] = Json::Value(true);
    args["options"]["limit"] = Json::Value(5);
    args["options"]["filter"] = Json::Value();

    Json::Value filter;
    filter["fieldName"] = Json::Value(0);
    filter["fieldValue"] = Json::Value("Alexander");

    args["options"]["filter"].append(filter);
    args["options"]["sort"].append(Json::Value());

    Json::Value result = pimContacts.Find(args);

    Json::Value expected;
    expected["_success"] = Json::Value(true);
    expected["contacts"] = Json::Value();

    EXPECT_EQ(true, result["_success"].asBool());
    size = result["contacts"].size();
    EXPECT_EQ(0, size);
}

TEST(PimContacts, CanEditContact)
{
    webworks::PimContactsQt pimContacts;
    Json::Value args;

    args["id"] = Json::Value(contactId);
    args["emails"] = Json::Value();

    Json::Value workEmail = Json::Value();
    workEmail["type"] = Json::Value("home");
    workEmail["value"] = Json::Value("asmitherman@gmail.com");

    args["emails"].append(workEmail);

    Json::Value result = pimContacts.Save(args);

    EXPECT_EQ(true, result["_success"].asBool());
    EXPECT_EQ(contactId, result["id"].asInt());
}

TEST(PimContacts, CanCloneContact)
{
    webworks::PimContactsQt pimContacts;
    Json::Value args;

    args["id"] = Json::Value(-1 * contactId);
    Json::Value result = pimContacts.Save(args);

    EXPECT_EQ(true, result["_success"].asBool());
    EXPECT_NE(contactId, result["id"].asInt());

    Json::Value removeArgs;
    removeArgs["contactId"] = Json::Value(result["id"]);
    Json::Value removeResult = pimContacts.DeleteContact(removeArgs);
    EXPECT_EQ(true, removeResult["_success"].asBool());
}

TEST(PimContacts, CanRemoveContact)
{
    webworks::PimContactsQt pimContacts;
    Json::Value args;

    args["contactId"] = Json::Value(contactId);

    Json::Value result = pimContacts.DeleteContact(args);

    EXPECT_EQ(true, result["_success"].asBool());
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
