ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=bbm
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk

SRCS+=bbm_bps.cpp \
      bbm_js.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=bps bbmsp socket QtCore
