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

#ifndef IDS_JS_HPP_
#define IDS_JS_HPP_

#include <pthread.h>
#include <string>
#include <ids.h>

#include "../common/plugin.h"

extern "C" {
	typedef struct ids_provider_map_t {
		const char *providerName;
		int providerFd;
		ids_provider_t *provider;
		ids_provider_map_t *next;
	} ids_provider_mapping;

	void getTokenSuccessCB(ids_request_id_t requestId, const char *token, int paramCount, const ids_token_param_t *params, void *cbData);
	void getPropertiesSuccessCB( ids_request_id_t requestId, int propertyCount, const ids_property_t* properties, void* cb_data );
	void clearTokenSuccessCB( ids_request_id_t requestId, bool clear, void* cb_data );
	void failureCB(ids_request_id_t requestId, ids_result_t result, const char *failureInfo, void *cbData);
	static int my_process_msg( int fd, int aint, void *cbData );

}

class IDSEXT : public JSExt
{
public:
    explicit IDSEXT(const std::string& id);
    virtual ~IDSEXT() { ids_shutdown(); pthread_join(m_thread, NULL); m_thread = 0; }
    virtual std::string InvokeMethod(const std::string& command);
    virtual bool CanDelete();
    void NotifyEvent(const std::string& eventId, const std::string& event);

	static void* idsEventThread(void *args);
	std::string GetVersion();
	std::string RegisterProvider(const std::string& providerName);
	std::string SetOption(int option, const std::string& value);

	std::string GetToken(const std::string& provider, const std::string& tokenType, const std::string& appliesTo);
	std::string ClearToken(const std::string& provider, const std::string& tokenType, const std::string& appliesTo);
	std::string GetProperties(const std::string& provider, int numProps, const char* properties);

	// Needed for callbacks which are not included in IDSEXT class
	std::string getEventId();
	int getFd();


private:
    pthread_t m_thread;
	int ids_fd;
	int numFds;
	fd_set tRfd;
	ids_provider_mapping *providers;
    std::string m_id;
    std::string event_id;
    
    ids_provider_mapping* getProvider(const std::string& provider);
    std::string getErrorDescription();
};

#endif // IDS_JS_HPP_
