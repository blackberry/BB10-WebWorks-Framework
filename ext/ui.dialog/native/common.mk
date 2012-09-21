ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=dialog
PLUGIN=yes
JSON=yes

include ../../../../meta.mk

SRCS+=dialog_bps.cpp \
      dialog_js.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=bps