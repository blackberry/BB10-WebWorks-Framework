ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=connection
PLUGIN=yes

include ../../../../meta.mk

SRCS+=connection_bps.cpp \
      connection_js.cpp

ifeq ($(UNITTEST),yes)
NAME=test
SRCS+=test_main.cpp
USEFILE=
endif

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=bps