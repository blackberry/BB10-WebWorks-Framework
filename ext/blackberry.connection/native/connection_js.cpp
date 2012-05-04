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
#include "connection_js.h"
#include "connection_bps.h"

Connection::Connection(const std::string& id) : m_id(id)
{

}

char* onGetObjList()
{
	static char name[] = "Connection";
	return name;
}

JSExt* onCreateObject(const std::string& className, const std::string& id)
{
	if (className != "Connection") {
		return NULL;
	}

	return new Connection(id);
}

std::string Connection::InvokeMethod(const std::string& command)
{
	int index = command.find_first_of(" ");

	string strCommand = command.substr(0, index);
	string jsonObject = command.substr(index + 1, command.length());
	char buffer;
	string returnValue;

	if (strCommand == "getType") {
		ConnectionBPS *connection = new ConnectionBPS();
		itoa(connection->GetConnectionType(), &buffer, 10);
		returnValue.assign(&buffer);
	}

	return returnValue;
}

