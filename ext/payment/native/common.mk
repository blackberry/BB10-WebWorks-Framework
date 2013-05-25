ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=paymentjnext
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk

CCFLAGS+=-Wno-deprecated-declarations

SRCS+=payment_js.cpp \
      payment_bps.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=bps
