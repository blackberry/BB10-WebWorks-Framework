QNX_INCLUDE=$(QNX_TARGET)/usr/include
QNX_USR_LIB=$(QNX_TARGET)/$(CPUVARDIR)/usr/lib
QNX_LIB=$(QNX_TARGET)/$(CPUVARDIR)/lib

WEBWORKS_DIR=../../../../..

CCFLAGS+=-Werror
LDFLAGS+=-Wl,-rpath,./app/native/plugins/jnext,-z,defs,-s

EXTRA_LIBVPATH+=$(QNX_LIB) \
                $(QNX_USR_LIB) \
                $(QNX_USR_LIB)/qt4/lib \
                $(WEBWORKS_DIR)/ext/json/native/$(CPU)/$(VARIANT1)

EXTRA_INCVPATH+=$(QNX_INCLUDE) \
                $(QNX_INCLUDE)/qt4 \
                $(QNX_INCLUDE)/qt4/Qt \
                $(QNX_INCLUDE)/qt4/QtCore \
                $(WEBWORKS_DIR)/dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common \
                $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.5.0/include

EXTRA_SRCVPATH+=$(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json \
                $(WEBWORKS_DIR)/dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common

ifeq ($(PLUGIN),yes)
SRCS+=$(WEBWORKS_DIR)/dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common/plugin.cpp
endif

ifeq ($(JSON),yes)
	ifeq ($(UNITTEST),yes)
	SRCS+=$(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.5.0/src/json_reader.cpp \
		  $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.5.0/src/json_value.cpp \
	  	  $(WEBWORKS_DIR)/dependencies/JsonCpp/jsoncpp-src-0.5.0/src/json_writer.cpp
	else
	LDFLAGS+=-ljson
	endif
endif

ifeq ($(UNITTEST),yes)
EXTRA_INCVPATH+=$(WEBWORKS_DIR)/dependencies/gmock-1.5.0/fused-src
EXTRA_SRCVPATH+=$(WEBWORKS_DIR)/dependencies/gmock-1.5.0/fused-src
SRCS+=$(WEBWORKS_DIR)/dependencies/gmock-1.5.0/fused-src/gmock-gtest-all.cpp
endif
