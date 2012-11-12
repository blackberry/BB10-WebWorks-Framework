ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=utils
LDFLAGS+=-Wl,-h,libutils.so

include ../../../../meta.mk

SRCS+=$(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/lib_json/json_reader.cpp \
      $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/lib_json/json_value.cpp \
      $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/lib_json/json_writer.cpp \
      webworks_utils.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS += socket
