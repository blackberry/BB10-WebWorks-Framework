ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=sensors
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk

SRCS+=sensors_ndk.cpp \
      sensors_js.cpp

ifeq ($(UNITTEST),yes)
#NAME=test
#SRCS+=test_main.cpp
USEFILE=
endif

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=sensor
