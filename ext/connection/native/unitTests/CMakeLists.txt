if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "-Werror -lang-c++ -fexceptions ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS "-Werror ${CMAKE_C_FLAGS}")
endif ()

set(srcs
    test_main.cpp
    ../connection_bps.cpp
    ../connection_js.cpp
    ../../../../dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common/plugin.cpp
    ../../../../dependencies/gmock-1.5.0/fused-src/gmock-gtest-all.cc
)

include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_SOURCE_DIR}/../../../dependencies/gmock-1.5.0/fused-src/)

add_definitions(-DXP_UNIX)
add_executable(test ${srcs})

target_link_libraries(test m bps)
set_target_properties(test PROPERTIES PREFIX "")
