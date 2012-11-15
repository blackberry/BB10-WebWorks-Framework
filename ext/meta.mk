QNX_INCLUDE=$(QNX_TARGET)/usr/include
QNX_USR_LIB=$(QNX_TARGET)/$(CPUVARDIR)/usr/lib
QNX_LIB=$(QNX_TARGET)/$(CPUVARDIR)/lib

WEBWORKS_DIR=../../../../..

CCFLAGS+=-fstack-protector-strong -fPIC -D_FORTIFY_SOURCE=2 -Wtrampolines -Wall -Wextra -Wformat=2 -Werror
LDFLAGS+=-Wl,-rpath,./app/native/plugins/jnext,-z,relro,-z,now,-s

EXTRA_LIBVPATH+=$(QNX_LIB) \
                $(QNX_USR_LIB) \
                $(QNX_USR_LIB)/qt4/lib \
                $(WEBWORKS_DIR)/ext/utils/native/$(CPU)/$(VARIANT1)

EXTRA_INCVPATH+=$(QNX_INCLUDE) \
                $(QNX_INCLUDE)/qt4 \
                $(QNX_INCLUDE)/qt4/Qt \
                $(QNX_INCLUDE)/qt4/QtCore \
                $(WEBWORKS_DIR)/dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common \
                $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/include \
                $(WEBWORKS_DIR)/ext/utils/native

EXTRA_SRCVPATH+=$(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/lib_json \
                $(WEBWORKS_DIR)/dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common

ifeq ($(PLUGIN),yes)
SRCS+=$(WEBWORKS_DIR)/dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common/plugin.cpp
endif

ifeq ($(UTILS),yes)
	ifeq ($(UNITTEST),yes)
	SRCS+=$(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/json_reader.cpp \
		  $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/json_value.cpp \
	  	  $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.6.0-rc2/src/json_writer.cpp
	else
	LDFLAGS+=-lutils
	endif
endif

ifeq ($(UNITTEST),yes)
EXTRA_INCVPATH+=$(WEBWORKS_DIR)/dependencies/gmock-1.5.0/fused-src
EXTRA_SRCVPATH+=$(WEBWORKS_DIR)/dependencies/gmock-1.5.0/fused-src
SRCS+=$(WEBWORKS_DIR)/dependencies/gmock-1.5.0/fused-src/gmock-gtest-all.cpp
endif
