ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=pushjnext
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk

SRCS+=push_js.cpp \
      push_ndk.cpp

ifeq ($(UNITTEST),yes)
NAME=test
SRCS+=test_main.cpp
USEFILE=
endif

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=PushService